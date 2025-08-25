import { config } from 'dotenv';
config();

import '@/ai/flows/generate-emails.ts';
import '@/ai/flows/provide-feedback.ts';
import '@/ai/flows/summarize-performance.ts';
