'use server';

import {
  processVoiceCommand,
  ProcessVoiceCommandInput,
} from '@/ai/flows/process-voice-command';
import {
  processVoiceCommandAddCredit,
  ProcessVoiceCommandAddCreditInput,
} from '@/ai/flows/process-voice-command-add-credit';
import {
  processVoiceCommandCheckBalance,
  ProcessVoiceCommandCheckBalanceInput,
} from '@/ai/flows/process-voice-command-check-balance';
import {
  processVoiceCommandRecordSale,
  ProcessVoiceCommandRecordSaleInput,
} from '@/ai/flows/process-voice-command-record-sale';
import { z } from 'zod';

const commandSchema = z.string().min(1, { message: 'Command cannot be empty.' });

type VoiceCommandResult =
  | { type: 'ADD_STOCK'; data: any }
  | { type: 'RECORD_SALE'; data: any }
  | { type: 'ADD_CREDIT'; data: any }
  | { type: 'CHECK_BALANCE'; data: any }
  | { error: string; details?: string };

/**
 * @deprecated Use handleChatMessage instead.
 */
export async function handleVoiceCommand(
  command: string
): Promise<VoiceCommandResult> {
  return handleChatMessage(command);
}

export async function handleChatMessage(
  command: string
): Promise<VoiceCommandResult> {
  const validation = commandSchema.safeParse(command);
  if (!validation.success) {
    return { error: 'Invalid command' };
  }

  const lowerCaseCommand = command.toLowerCase();

  try {
    if (
      lowerCaseCommand.includes('stock') ||
      lowerCaseCommand.includes('add') ||
      lowerCaseCommand.includes('khareed') ||
      lowerCaseCommand.includes('purchase')
    ) {
      const result = await processVoiceCommand({ voiceCommand: command });
      return { type: 'ADD_STOCK', data: result };
    }
    if (
      lowerCaseCommand.includes('sale') ||
      lowerCaseCommand.includes('bech') ||
      lowerCaseCommand.includes('sold')
    ) {
      const result = await processVoiceCommandRecordSale({
        transcribedText: command,
      });
      return { type: 'RECORD_SALE', data: result };
    }
    if (
      lowerCaseCommand.includes('credit') ||
      lowerCaseCommand.includes('udhaar')
    ) {
      const result = await processVoiceCommandAddCredit({
        voiceCommand: command,
      });
      return { type: 'ADD_CREDIT', data: result };
    }
    if (
      lowerCaseCommand.includes('balance') ||
      lowerCaseCommand.includes('khata')
    ) {
      const result = await processVoiceCommandCheckBalance({
        transcribedText: command,
      });
      return { type: 'CHECK_BALANCE', data: result };
    }

    return { error: 'Could not determine the intent of your command.' };
  } catch (e: any) {
    console.error('AI flow failed:', e);
    return {
      error: 'Failed to process command.',
      details: e.message || 'An unknown error occurred.',
    };
  }
}
