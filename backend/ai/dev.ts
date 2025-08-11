import { config } from 'dotenv';
config();

import '@/ai/flows/process-voice-command-add-credit.ts';
import '@/ai/flows/process-voice-command-check-balance.ts';
import '@/ai/flows/process-voice-command-record-sale.ts';
import '@/ai/flows/process-voice-command.ts';