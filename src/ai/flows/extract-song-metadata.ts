'use server';

/**
 * @fileOverview A flow to extract song metadata (artist, title) from audio files.
 *
 * - extractSongMetadata - A function that handles the song metadata extraction process.
 * - ExtractSongMetadataInput - The input type for the extractSongMetadata function.
 * - ExtractSongMetadataOutput - The return type for the extractSongMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSongMetadataInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractSongMetadataInput = z.infer<typeof ExtractSongMetadataInputSchema>;

const ExtractSongMetadataOutputSchema = z.object({
  artist: z.string().describe('The artist of the song.'),
  title: z.string().describe('The title of the song.'),
});
export type ExtractSongMetadataOutput = z.infer<typeof ExtractSongMetadataOutputSchema>;

export async function extractSongMetadata(input: ExtractSongMetadataInput): Promise<ExtractSongMetadataOutput> {
  return extractSongMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSongMetadataPrompt',
  input: {schema: ExtractSongMetadataInputSchema},
  output: {schema: ExtractSongMetadataOutputSchema},
  prompt: `You are an expert music metadata extractor.

You will be provided with an audio file. You will extract the artist and title of the song from the audio file. If you cannot determine the artist or title, you should leave it blank, but make your best effort to detect the song's metadata.

Audio: {{media url=audioDataUri}}`,
});

const extractSongMetadataFlow = ai.defineFlow(
  {
    name: 'extractSongMetadataFlow',
    inputSchema: ExtractSongMetadataInputSchema,
    outputSchema: ExtractSongMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
