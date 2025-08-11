'use server';

/**
 * @fileOverview This file defines a Genkit flow for processing voice commands to add stock to the inventory.
 *
 * - processVoiceCommand - A function that processes voice commands and adds stock to the inventory.
 * - ProcessVoiceCommandInput - The input type for the processVoiceCommand function.
 * - ProcessVoiceCommandOutput - The return type for the processVoiceCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessVoiceCommandInputSchema = z.object({
  voiceCommand: z
    .string()
    .describe('The voice command transcribed to text.'),
});
export type ProcessVoiceCommandInput = z.infer<typeof ProcessVoiceCommandInputSchema>;

const ProcessVoiceCommandOutputSchema = z.object({
  intent: z.string().describe('The intent of the voice command (e.g., ADD_STOCK).'),
  product_name: z.string().describe('The name of the product.'),
  quantity: z.number().describe('The quantity of the product to add to stock.'),
});
export type ProcessVoiceCommandOutput = z.infer<typeof ProcessVoiceCommandOutputSchema>;

export async function processVoiceCommand(input: ProcessVoiceCommandInput): Promise<ProcessVoiceCommandOutput> {
  return processVoiceCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processVoiceCommandPrompt',
  input: {schema: ProcessVoiceCommandInputSchema},
  output: {schema: ProcessVoiceCommandOutputSchema},
  prompt: `Given the user request: "{{voiceCommand}}", convert it into a JSON command.
  The valid intents are \"ADD_STOCK\".
  Extract entities like \"product_name\" and \"quantity\".
  Return a JSON string.
  {
    \"intent\": \"ADD_STOCK\",
    \"product_name\": \"STRING\".
    \"quantity\": \"INTEGER\"
  }`,
});

const processVoiceCommandFlow = ai.defineFlow(
  {
    name: 'processVoiceCommandFlow',
    inputSchema: ProcessVoiceCommandInputSchema,
    outputSchema: ProcessVoiceCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
