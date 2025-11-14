'use server';

import { z } from 'zod';
import { recommendSongsBasedOnUserInput } from '@/ai/flows/recommend-songs';
import { generatePlaylistDescription } from '@/ai/flows/generate-playlist-description';
import { extractSongMetadata } from '@/ai/flows/extract-song-metadata';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Song } from '@/lib/types';

const recommendationFormSchema = z.object({
  prompt: z.string().min(3, { message: 'Prompt must be at least 3 characters long.' }),
});

function parseSongString(songString: string, index: number): Song {
  const parts = songString.split(' by ');
  const title = parts[0]?.trim() || 'Unknown Title';
  const artist = parts[1]?.trim() || 'Unknown Artist';
  
  const placeholderIndex = index % PlaceHolderImages.length;
  const albumArt = PlaceHolderImages[placeholderIndex];

  return {
    title,
    artist,
    albumArt: {
      imageUrl: albumArt.imageUrl,
      imageHint: albumArt.imageHint,
    },
  };
}

export async function getRecommendations(prevState: any, formData: FormData) {
  const validatedFields = recommendationFormSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const userInput = validatedFields.data.prompt;

  try {
    const { recommendations } = await recommendSongsBasedOnUserInput({ userInput });

    if (!recommendations || recommendations.length === 0) {
      return { error: { _form: ['Could not generate recommendations. Try a different prompt.'] } };
    }

    const songs = recommendations.map(parseSongString).filter(song => song.title !== 'Unknown Title');

    if (songs.length === 0) {
        return { error: { _form: ['AI returned recommendations in an unexpected format. Please try again.'] } };
    }
    
    const songMetadatas = songs.map(s => ({ title: s.title, artist: s.artist }));

    const { description } = await generatePlaylistDescription({ songs: songMetadatas });
    
    return {
      songs,
      description,
    };
  } catch (e) {
    console.error(e);
    return { error: { _form: ['An unexpected error occurred with the AI service.'] } };
  }
}

export async function analyzeSong(prevState: any, formData: FormData) {
  const audioFile = formData.get('audioFile') as File;

  if (!audioFile || audioFile.size === 0) {
    return { error: 'Please select an audio file.' };
  }
  
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
  if (!allowedTypes.includes(audioFile.type)) {
      return { error: 'Invalid file type. Please upload an MP3, WAV, or OGG file.'};
  }

  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioDataUri = `data:${audioFile.type};base64,${buffer.toString('base64')}`;

    const metadata = await extractSongMetadata({ audioDataUri });

    if(!metadata.artist || !metadata.title) {
        return { error: 'Could not identify song. Please try a different audio file.' };
    }

    return { metadata };
  } catch (e) {
    console.error(e);
    return { error: 'Could not analyze song. The audio might not be recognized or the file may be too large.' };
  }
}
