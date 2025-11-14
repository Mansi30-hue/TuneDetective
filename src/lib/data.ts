import type { Song } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function getArt(index: number) {
  const placeholderIndex = index % PlaceHolderImages.length;
  const image = PlaceHolderImages[placeholderIndex];
  return {
    imageUrl: image.imageUrl,
    imageHint: image.imageHint,
  }
}

export const initialSongs: Song[] = [
  {
    title: 'Cosmic Drift',
    artist: 'Galaxy Runners',
    albumArt: getArt(0),
  },
  {
    title: 'Ocean Breath',
    artist: 'Tidal Wave',
    albumArt: getArt(1),
  },
  {
    title: 'City Glow',
    artist: 'Neon Knights',
    albumArt: getArt(2),
  },
  {
    title: 'Forest Echo',
    artist: 'Whispering Pines',
    albumArt: getArt(3),
  },
  {
    title: 'Desert Mirage',
    artist: 'Sand Scape',
    albumArt: getArt(4),
  },
  {
    title: 'Mountain High',
    artist: 'Summit Seekers',
    albumArt: getArt(5),
  },
  {
    title: 'Retro Future',
    artist: 'Chrome Dreams',
    albumArt: getArt(6),
  },
  {
    title: 'Midnight Drive',
    artist: 'The Night owls',
    albumArt: getArt(7),
  },
  {
    title: 'Sunrise Groove',
    artist: 'Dawn Patrol',
    albumArt: getArt(8),
  },
  {
    title: 'Velvet Moon',
    artist: 'Luna Serenade',
    albumArt: getArt(9),
  },
];
