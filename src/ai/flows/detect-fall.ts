/ detect-fall.ts
'use server';

/**
 * @fileOverview Detects sudden immobilization using sensor data and triggers an alert.
 *
 * - detectFall - A function to detect falls and trigger alerts.
 * - DetectFallInput - The input type for the detectFall function.
 * - DetectFallOutput - The return type for the detectFall function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {sendSms} from '@/services/sms';
import {getCurrentLocation} from '@/services/location';
import {redirect} from 'next/navigation';
import { cookies } from 'next/headers';

const DetectFallInputSchema = z.object({
  accelerometerData: z.array(z.number()).describe('Accelerometer data readings.'),
  gyroscopeData: z.array(z.number()).describe('Gyroscope data readings.'),
  emergencyContactNumber: z.string().describe('Emergency contact phone number'),
  vitalInfo: z.string().describe('User vital information'),
});

export type DetectFallInput = z.infer<typeof DetectFallInputSchema>;

const DetectFallOutputSchema = z.object({
  fallDetected: z.boolean().describe('Whether a fall was detected.'),
  message: z.string().optional().describe('Fall detection message'),
});

export type DetectFallOutput = z.infer<typeof DetectFallOutputSchema>;

export async function detectFall(input: DetectFallInput): Promise<DetectFallOutput> {
  return detectFallFlow(input);
}

const detectFallPrompt = ai.definePrompt({
  name: 'detectFallPrompt',
  input: {
    schema: z.object({
      accelerometerData: z.string().describe('Accelerometer data readings.'),
      gyroscopeData: z.string().describe('Gyroscope data readings.'),
      emergencyContactNumber: z.string().describe('Emergency contact phone number'),
      vitalInfo: z.string().describe('User vital information'),
    }),
  },
  output: {
    schema: z.object({
      fallDetected: z.boolean().describe('Whether a fall was detected.'),
      message: z.string().optional().describe('Fall detection message'),
    }),
  },
  prompt: `You are an AI assistant specializing in fall detection. Analyze the sensor data to determine if a fall has occurred.

  Here's the user's vital information: {{{vitalInfo}}}

  Here's the accelerometer data: {{{accelerometerData}}}
  Here's the gyroscope data: {{{gyroscopeData}}}

  If a fall is detected, set fallDetected to true and return a message explaining the situation. Otherwise, set fallDetected to false.
  If the sensor data indicates a sudden, prolonged immobilization, consider it a fall.
`,
});

const detectFallFlow = ai.defineFlow<
  typeof DetectFallInputSchema,
  typeof DetectFallOutputSchema
>(
  {
    name: 'detectFallFlow',
    inputSchema: DetectFallInputSchema,
    outputSchema: DetectFallOutputSchema,
  },
  async input => {
    const activeMonitoringCookie = cookies().get('activeMonitoring');
    const activeMonitoring = activeMonitoringCookie?.value === 'true';

    if (!activeMonitoring) {
      return {
        fallDetected: false,
      };
    }

    const {output} = await detectFallPrompt({
      accelerometerData: JSON.stringify(input.accelerometerData),
      gyroscopeData: JSON.stringify(input.gyroscopeData),
      emergencyContactNumber: input.emergencyContactNumber,
      vitalInfo: input.vitalInfo,
    });

    if (output?.fallDetected) {
      const location = await getCurrentLocation();
      const message = `Fall detected! User location: Lat ${location.lat}, Lng ${location.lng}. ${output.message ?? ''}. Vital Info: ${input.vitalInfo}. Active Monitoring: ${activeMonitoring}`;
      await sendSms(input.emergencyContactNumber, message);
      cookies().set('emergency', 'true', { path: '/' });

      return {
        fallDetected: true,
        message,
      };
    }

    return {
      fallDetected: false,
    };
  }
);
