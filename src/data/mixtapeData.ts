import { MoodKey, Service, ServiceKey, Tape, Track } from '../types/mixtape';

export const servicesSeed: Service[] = [
  {
    key: 'spotify',
    name: 'Spotify',
    accent: '#1ED760',
    description: 'Best for discovery, blends, and fast playlist import.',
    connected: true,
  },
  {
    key: 'apple',
    name: 'Apple Music',
    accent: '#FA2D48',
    description: 'High fidelity catalog with tight iPhone ecosystem support.',
    connected: false,
  },
  {
    key: 'tidal',
    name: 'TIDAL',
    accent: '#7C5CFF',
    description: 'Editorial picks and premium listening for detail-first users.',
    connected: false,
  },
];

export const tapesSeed: Tape[] = [
  {
    id: 'tape-1',
    title: 'Neon Afterglow',
    subtitle: 'A glossy night-drive mix built from saved likes and recent repeats.',
    service: 'Spotify',
    trackCount: 12,
    duration: '43 min',
    gradient: ['#FD6B2F', '#A63DFF'],
  },
  {
    id: 'tape-2',
    title: 'Sunday in Silver',
    subtitle: 'Warm R&B, indie soul, and low-stakes optimism for slow mornings.',
    service: 'Apple Music',
    trackCount: 9,
    duration: '31 min',
    gradient: ['#3CC8FF', '#1A5CFF'],
  },
  {
    id: 'tape-3',
    title: 'Blue Room Draft',
    subtitle: 'A tighter cut aimed at late-night headphones and zero skips.',
    service: 'TIDAL',
    trackCount: 14,
    duration: '52 min',
    gradient: ['#121212', '#5B5B5B'],
  },
];

export const discoveryTracks: Track[] = [
  { id: '1', title: 'Midnight Sender', artist: 'NOVA STATIC', service: 'spotify', duration: '3:42', energy: 'Velvet synth' },
  { id: '2', title: 'Summer Receiver', artist: 'Mika Vale', service: 'apple', duration: '4:08', energy: 'Bright pop' },
  { id: '3', title: 'Soft Focus', artist: 'Juno Atlas', service: 'tidal', duration: '2:58', energy: 'Alt-R&B' },
  { id: '4', title: 'Corner Booth', artist: 'The Night Guests', service: 'spotify', duration: '3:25', energy: 'Indie groove' },
  { id: '5', title: 'Glass Hearts', artist: 'Avery Monroe', service: 'apple', duration: '3:54', energy: 'Slow burn' },
  { id: '6', title: 'Signal Fade', artist: 'Hotel Fiction', service: 'tidal', duration: '4:11', energy: 'Cinematic' },
];

export const moods: MoodKey[] = ['Late Night', 'Road Trip', 'Soft Launch', 'After Hours'];

export const serviceLabel = (key: ServiceKey) => {
  if (key === 'spotify') return 'Spotify';
  if (key === 'apple') return 'Apple Music';
  return 'TIDAL';
};
