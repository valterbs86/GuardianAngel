'use server';
/**
 * @fileOverview An AI agent to assess the severity of an emergency situation based on video and audio input.
 *
 * - assessSituation - A function that handles the situation assessment process.
 * - AssessSituationInput - The input type for the assessSituation function.
 * - AssessSituationOutput - The return type for the assessSituation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AssessSituationInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the recorded video.'),
  audioUrl: z.string().describe('The URL of the recorded audio.'),
});
export type AssessSituationInput = z.infer<typeof AssessSituationInputSchema>;

const AssessSituationOutputSchema = z.object({
  severity: z.enum(['low', 'moderate', 'high']).describe('The assessed severity of the situation.'),
  summary: z.string().describe('A brief summary of the situation.'),
  recommendations: z.array(z.string()).describe('Recommendations based on the situation.'),
});
export type AssessSituationOutput = z.infer<typeof AssessSituationOutputSchema>;

export async function assessSituation(input: AssessSituationInput): Promise<AssessSituationOutput> {
  return assessSituationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessSituationPrompt',
  input: {
    schema: z.object({
      videoUrl: z.string().describe('The URL of the recorded video.'),
      audioUrl: z.string().describe('The URL of the recorded audio.'),
    }),
  },
  output: {
    schema: z.object({
      severity: z.enum(['low', 'moderate', 'high']).describe('The assessed severity of the situation.'),
      summary: z.string().describe('A brief summary of the situation.'),
      recommendations: z.array(z.string()).describe('Recommendations based on the situation.'),
    }),
  },
  prompt: `You are an AI agent that assesses emergency situations based on video and audio input.\n\nAnalyze the provided video and audio to determine the severity of the situation. Provide a summary of the situation and recommendations for action.\n\nVideo URL: {{videoUrl}}\nAudio URL: {{audioUrl}}\n\nConsider the following factors when assessing severity:\n- Presence of violence or threats\n- Evidence of injury or distress\n- Environmental hazards\n- Clarity of communication\n\nOutput the severity as one of the following enums: low, moderate, high.\n`,
});

const assessSituationFlow = ai.defineFlow<
  typeof AssessSituationInputSchema,
  typeof AssessSituationOutputSchema
>({
  name: 'assessSituationFlow',
  inputSchema: AssessSituationInputSchema,
  outputSchema: AssessSituationOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
