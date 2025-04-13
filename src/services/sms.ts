/**
 * Sends an SMS message to the specified phone number.
 *
 * @param phoneNumber The phone number to send the SMS to.
 * @param message The message to send.
 * @returns A promise that resolves when the SMS is sent successfully.
 */
export async function sendSms(phoneNumber: string, message: string): Promise<void> {
  // TODO: Implement this by calling an API.
  console.log(`Sending SMS to ${phoneNumber} with message: ${message}`);
  return;
}
