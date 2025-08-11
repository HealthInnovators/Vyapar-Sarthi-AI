'use server';
/**
 * @fileOverview A voice command processing AI agent for recording sales.
 *
 * - processVoiceCommandRecordSale - A function that handles the voice command processing for recording sales.
 * - ProcessVoiceCommandRecordSaleInput - The input type for the processVoiceCommandRecordSale function.
 * - ProcessVoiceCommandRecordSaleOutput - The return type for the processVoiceCommandRecordSale function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessVoiceCommandRecordSaleInputSchema = z.object({
  transcribedText: z
    .string()
    .describe('The transcribed text from the user\'s voice command.'),
});
export type ProcessVoiceCommandRecordSaleInput = z.infer<
  typeof ProcessVoiceCommandRecordSaleInputSchema
>;

const ProcessVoiceCommandRecordSaleOutputSchema = z.object({
  intent: z.literal('RECORD_SALE').describe('The intent of the voice command.'),
  entities: z.object({
    product_name: z.string().describe('The name of the product sold.'),
    quantity: z.number().describe('The quantity of the product sold.'),
  }),
  confidence_score: z
    .number()
    .optional()
    .describe('The confidence score of the LLM.'),
});
export type ProcessVoiceCommandRecordSaleOutput = z.infer<
  typeof ProcessVoiceCommandRecordSaleOutputSchema
>;

export async function processVoiceCommandRecordSale(
  input: ProcessVoiceCommandRecordSaleInput
): Promise<ProcessVoiceCommandRecordSaleOutput> {
  return processVoiceCommandRecordSaleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processVoiceCommandRecordSalePrompt',
  input: {schema: ProcessVoiceCommandRecordSaleInputSchema},
  output: {schema: ProcessVoiceCommandRecordSaleOutputSchema},
  prompt: `Given the user request: "{{transcribedText}}", convert it into a JSON command.

The valid intent is "RECORD_SALE".

Extract entities like "product_name" and "quantity".

Ensure the quantity is extracted as a number.

Return a confidence score if available.

Output should be in the following JSON format:

{  "intent": "RECORD_SALE",
  "entities": {
    "product_name": "STRING",
    "quantity": INTEGER,
  },
  "confidence_score": FLOAT // Optional
}
`,
});

const processVoiceCommandRecordSaleFlow = ai.defineFlow(
  {
    name: 'processVoiceCommandRecordSaleFlow',
    inputSchema: ProcessVoiceCommandRecordSaleInputSchema,
    outputSchema: ProcessVoiceCommandRecordSaleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
