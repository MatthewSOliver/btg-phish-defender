import type { Email as AIEmail } from '@/ai/flows/generate-emails';
import type { ProvideFeedbackOutput as AIFeedback } from '@/ai/flows/provide-feedback';

// Extends the AI-generated Email type with a client-side ID
export type Email = AIEmail & { id: string };

// Re-exports the AI feedback output type for use in components
export type ProvideFeedbackOutput = AIFeedback;

// Defines the possible classifications a user can make
export type UserClassification = 'Safe' | 'Phishing';
