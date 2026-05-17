import type { TapeTrack } from '../data/seedTape';

export type QueueListRow = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  isActive: boolean;
};

export function getQueueListRows(tracks: TapeTrack[], trackIndex: number): QueueListRow[] {
  return tracks.map((track, index) => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    isActive: index === trackIndex,
  }));
}
