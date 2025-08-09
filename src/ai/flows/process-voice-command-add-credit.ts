'use server';
/**
 * @fileOverview A voice command processing AI agent for adding credit transactions.
 *
 * - processVoiceCommandAddCredit - A function that handles the voice command processing to add a credit transaction.
 * - ProcessVoiceCommandAddCreditInput - The input type for the processVoiceCommandAddCredit function.
 * - ProcessVoiceCommandAddCreditOutput - The return type for the processVoiceCommandAddCredit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessVoiceCommandAddCreditInputSchema = z.object({
  voiceCommand: z
    .string()
    .describe("The user's voice command as a transcribed text string."),
});
export type ProcessVoiceCommandAddCreditInput = z.infer<typeof ProcessVoiceCommandAddCreditInputSchema>;

const ProcessVoiceCommandAddCreditOutputSchema = z.object({
  intent: z.literal('ADD_CREDIT').describe('The intent of the voice command.'),
  entities: z.object({
    customer_name: z.string().describe('The name of the customer.'),
    amount: z.number().describe('The amount of credit to add.'),
  }).describe('The entities extracted from the voice command.'),
  confidence_score: z.number().optional().describe('The confidence score of the LLM.'),
});
export type ProcessVoiceCommandAddCreditOutput = z.infer<typeof ProcessVoiceCommandAddCreditOutputSchema>;

export async function processVoiceCommandAddCredit(input: ProcessVoiceCommandAddCreditInput): Promise<ProcessVoiceCommandAddCreditOutput> {
  return processVoiceCommandAddCreditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processVoiceCommandAddCreditPrompt',
  input: {schema: ProcessVoiceCommandAddCreditInputSchema},
  output: {schema: ProcessVoiceCommandAddCreditOutputSchema},
  prompt: `Given the user request: "{{voiceCommand}}", convert it into a JSON command.

The valid intents are: ADD_STOCK, RECORD_SALE, CHECK_BALANCE, ADD_CREDIT.

Extract entities like "product_name", "quantity", "customer_name", and "amount".

Ensure that the intent is ADD_CREDIT, and the entities include customer_name and amount.

Example JSON:
{
  "intent": "ADD_CREDIT",
  "entities": {
    "customer_name": "STRING",
    "amount": "DOUBLE"
  },
  "confidence_score": "FLOAT" // Optional
}

Return a JSON object:
`,
});

const processVoiceCommandAddCreditFlow = ai.defineFlow(
  {
    name: 'processVoiceCommandAddCreditFlow',
    inputSchema: ProcessVoiceCommandAddCreditInputSchema,
    outputSchema: ProcessVoiceCommandAddCreditOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
