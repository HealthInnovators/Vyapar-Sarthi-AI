'use server';
/**
 * @fileOverview Processes voice commands to check a party's current balance.
 *
 * - processVoiceCommandCheckBalance - A function that handles the voice command processing for checking balance.
 * - ProcessVoiceCommandCheckBalanceInput - The input type for the processVoiceCommandCheckBalance function.
 * - ProcessVoiceCommandCheckBalanceOutput - The return type for the processVoiceCommandCheckBalance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessVoiceCommandCheckBalanceInputSchema = z.object({
  transcribedText: z
    .string()
    .describe('The transcribed text from the user voice command.'),
});
export type ProcessVoiceCommandCheckBalanceInput = z.infer<
  typeof ProcessVoiceCommandCheckBalanceInputSchema
>;

const ProcessVoiceCommandCheckBalanceOutputSchema = z.object({
  intent: z.literal('CHECK_BALANCE').describe('The intent of the command.'),
  entities: z.object({
    customer_name: z.string().describe('The name of the customer.'),
  }),
  confidence_score: z
    .number()
    .optional()
    .describe('The confidence score of the LLM.'),
});
export type ProcessVoiceCommandCheckBalanceOutput = z.infer<
  typeof ProcessVoiceCommandCheckBalanceOutputSchema
>;

export async function processVoiceCommandCheckBalance(
  input: ProcessVoiceCommandCheckBalanceInput
): Promise<ProcessVoiceCommandCheckBalanceOutput> {
  return processVoiceCommandCheckBalanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processVoiceCommandCheckBalancePrompt',
  input: {schema: ProcessVoiceCommandCheckBalanceInputSchema},
  output: {schema: ProcessVoiceCommandCheckBalanceOutputSchema},
  prompt: `Given the user request: "{{transcribedText}}", convert it into a JSON command to check a party's balance. The valid intent is "CHECK_BALANCE". Extract entities like "customer_name". Return a JSON object with the intent and entities. If you are unable to extract the customer name, return null for the customer_name field.`,
});

const processVoiceCommandCheckBalanceFlow = ai.defineFlow(
  {
    name: 'processVoiceCommandCheckBalanceFlow',
    inputSchema: ProcessVoiceCommandCheckBalanceInputSchema,
    outputSchema: ProcessVoiceCommandCheckBalanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
