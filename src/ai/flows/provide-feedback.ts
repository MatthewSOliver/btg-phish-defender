// This file uses server-side code, so mark it with 'use server'
'use server';

/**
 * @fileOverview Provides AI-generated feedback on whether an email is phishing or safe.
 *
 * - provideFeedback - A function that generates feedback for an email classification.
 * - ProvideFeedbackInput - The input type for the provideFeedback function.
 * - ProvideFeedbackOutput - The return type for the provideFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the feedback request
const ProvideFeedbackInputSchema = z.object({
  email: z.object({
    sender: z.string().describe('The sender of the email'),
    subject: z.string().describe('The subject of the email'),
    body: z.string().describe('The body of the email'),
    isPhishing: z.boolean().describe('Whether the email is a phishing attempt or not'),
  }).describe('The email object to analyze'),
  userClassification: z.enum(['Safe', 'Phishing']).describe('The user\u2019s classification of the email'),
});
export type ProvideFeedbackInput = z.infer<typeof ProvideFeedbackInputSchema>;

// Define the output schema for the feedback
const ProvideFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-generated feedback explaining why the email is considered phishing or safe'),
  isCorrect: z.boolean().describe('Whether the user\u2019s classification was correct'),
});
export type ProvideFeedbackOutput = z.infer<typeof ProvideFeedbackOutputSchema>;

// Exported function to generate feedback
export async function provideFeedback(input: ProvideFeedbackInput): Promise<ProvideFeedbackOutput> {
  return provideFeedbackFlow(input);
}

// Define the prompt for generating feedback
const feedbackPrompt = ai.definePrompt({
  name: 'feedbackPrompt',
  input: {schema: ProvideFeedbackInputSchema},
  output: {schema: ProvideFeedbackOutputSchema},
  prompt: `You are an expert in identifying phishing emails. Given the following email and the user's classification, provide feedback explaining why the email is considered phishing or safe. Also, indicate whether the user's classification was correct.

Email:
Sender: {{{email.sender}}}
Subject: {{{email.subject}}}
Body: {{{email.body}}}

User Classification: {{{userClassification}}}

Analyze the email for phishing indicators such as suspicious links, unusual sender addresses, grammatical errors, urgent or threatening language, and requests for sensitive information. Compare your analysis to the user's classification and provide a detailed explanation in the feedback.

Ensure that your analysis is accurate, detailed, and educational. If the user's classification was correct, reinforce their understanding. If it was incorrect, explain the correct classification and the reasoning behind it.

Output 'feedback' should explain in detail the characteristics the AI detected, whether they are phishing or safe.
Output 'isCorrect' should be true or false, depending on whether the user was correct.
`,
});

// Define the Genkit flow
const provideFeedbackFlow = ai.defineFlow(
  {
    name: 'provideFeedbackFlow',
    inputSchema: ProvideFeedbackInputSchema,
    outputSchema: ProvideFeedbackOutputSchema,
  },
  async input => {
    const {email, userClassification} = input;

    // Determine if the user's classification was correct
    const isCorrect = email.isPhishing === (userClassification === 'Phishing');

    // Call the feedback prompt to get the AI-generated feedback
    const {output} = await feedbackPrompt(input);

    // Return the feedback and correctness status
    return {
      feedback: output!.feedback,
      isCorrect: isCorrect,
    };
  }
);
