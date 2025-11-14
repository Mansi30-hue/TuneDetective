// This is an AI-powered music recommendation system that suggests songs based on user input.
'use server';

/**
 * @fileOverview Recommends songs based on a text description of music preferences.
 *
 * - recommendSongsBasedOnUserInput - A function that recommends songs based on user input.
 * - RecommendSongsBasedOnUserInputInput - The input type for the recommendSongsBasedOnUserInput function.
 * - RecommendSongsBasedOnUserInputOutput - The return type for the recommendSongsBasedOnUserInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendSongsBasedOnUserInputInputSchema = z.object({
  userInput: z.string().describe('A text description of the music the user likes.'),
});
export type RecommendSongsBasedOnUserInputInput = z.infer<typeof RecommendSongsBasedOnUserInputInputSchema>;

const RecommendSongsBasedOnUserInputOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of recommended songs based on the user input.'),
});
export type RecommendSongsBasedOnUserInputOutput = z.infer<typeof RecommendSongsBasedOnUserInputOutputSchema>;

export async function recommendSongsBasedOnUserInput(input: RecommendSongsBasedOnUserInputInput): Promise<RecommendSongsBasedOnUserInputOutput> {
  return recommendSongsBasedOnUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSongsBasedOnUserInputPrompt',
  input: {schema: RecommendSongsBasedOnUserInputInputSchema},
  output: {schema: RecommendSongsBasedOnUserInputOutputSchema},
  prompt: `You are a music recommendation expert. Based on the user's description of their music preferences, recommend a list of songs.

User preferences: {{{userInput}}}

Recommendations:`, // Handlebars syntax for accessing input values
});

const recommendSongsBasedOnUserInputFlow = ai.defineFlow(
  {
    name: 'recommendSongsBasedOnUserInputFlow',
    inputSchema: RecommendSongsBasedOnUserInputInputSchema,
    outputSchema: RecommendSongsBasedOnUserInputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
