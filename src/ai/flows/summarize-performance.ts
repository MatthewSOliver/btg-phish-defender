
// This file uses server-side code, so mark it with 'use server';
'use server';

/**
 * @fileOverview Provides AI-generated summary of user's performance in the phishing game.
 *
 * - summarizePerformance - A function that generates a performance summary.
 * - SummarizePerformanceInput - The input type for the summarizePerformance function.
 * - SummarizePerformanceOutput - The return type for the summarizePerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailSchema = z.object({
  sender: z.string(),
  subject: z.string(),
  body: z.string(),
  isPhishing: z.boolean(),
});

const UserAnswerSchema = z.object({
  email: EmailSchema,
  userClassification: z.enum(['Safe', 'Phishing']),
  isCorrect: z.boolean(),
});

const SummarizePerformanceInputSchema = z.array(UserAnswerSchema).describe("An array of the user's answers throughout the game.");
export type SummarizePerformanceInput = z.infer<typeof SummarizePerformanceInputSchema>;

const SummarizePerformanceOutputSchema = z.object({
  summary: z.string().describe("A markdown-formatted summary of the user's performance, highlighting strengths and weaknesses."),
});
export type SummarizePerformanceOutput = z.infer<typeof SummarizePerformanceOutputSchema>;

export async function summarizePerformance(input: SummarizePerformanceInput): Promise<SummarizePerformanceOutput> {
  return summarizePerformanceFlow(input);
}

const summarizePerformancePrompt = ai.definePrompt({
  name: 'summarizePerformancePrompt',
  input: {schema: z.object({ gameHistory: z.string() })},
  output: {schema: SummarizePerformanceOutputSchema},
  prompt: `You are an expert security analyst reviewing a user's performance in a phishing detection game.
  
  Analyze the user's answers provided below. The data is a JSON string representing an array of objects, where each object contains the original email, the user's classification ('Safe' or 'Phishing'), and whether their answer was correct.
  
  Your task is to provide a concise, insightful summary of their performance in markdown format. 
  
  **Analysis Guidelines:**
  - **Identify Strengths:** Look for patterns in correct answers. Did the user consistently spot a particular type of phishing lure (e.g., misspelled domains, urgency)? Did they correctly identify legitimate emails?
  - **Identify Weaknesses:** Look for patterns in incorrect answers. What kind of tricks did the user fall for? Did they misclassify safe emails as phishing (false positives) or phishing emails as safe (false negatives)? Be specific. For example, "The user was often tricked by emails that created a false sense of urgency."
  - **Provide Actionable Feedback:** Offer 1-2 clear, actionable tips for improvement based on their specific mistakes. For example, "Always double-check the sender's email address for subtle misspellings" or "Be wary of emails demanding immediate action."
  - **Maintain a Positive and Encouraging Tone:** The goal is to educate, not to scold. Start with a positive reinforcement of what they did well.
  
  **Formatting:**
  - Use markdown for structure (e.g., headings, bold text, lists).
  - Use headings like '### What You Did Well' and '### Areas for Improvement'.
  - Do not reference the JSON structure directly in your output. Just provide the analysis.
  
  User's Game History:
  {{{gameHistory}}}
  `,
});

const summarizePerformanceFlow = ai.defineFlow(
  {
    name: 'summarizePerformanceFlow',
    inputSchema: SummarizePerformanceInputSchema,
    outputSchema: SummarizePerformanceOutputSchema,
  },
  async input => {
    const {output} = await summarizePerformancePrompt({ gameHistory: JSON.stringify(input) });
    return output!;
  }
);
