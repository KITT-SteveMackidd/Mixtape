export type TapeTrack = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
};

export type TapeSide = {
  id: 'A' | 'B';
  label: string;
  accent: string;
  tracks: TapeTrack[];
};

export type Tape = {
  id: string;
  title: string;
  creator: string;
  note: string;
  palette: {
    shell: string;
    label: string;
    ink: string;
    accent: string;
    accentSoft: string;
  };
  sides: TapeSide[];
};

export const seedTape: Tape = {
  id: 'night-drive-01',
  title: 'Night Drive Notes',
  creator: 'Steve',
  note: 'A first-pass mobile deck for private listening sessions, warm plastic, brushed metal, and a little motion in the reels.',
  palette: {
    shell: '#d2ba8d',
    label: '#f5e8c8',
    ink: '#2d2418',
    accent: '#ff7a59',
    accentSoft: '#ffd166',
  },
  sides: [
    {
      id: 'A',
      label: 'Side A',
      accent: '#ff7a59',
      tracks: [
        { id: 'A1', title: 'City Glow', artist: 'June Motel', duration: '03:12', mood: 'neon hum' },
        { id: 'A2', title: 'Rearview', artist: 'Static Bloom', duration: '04:08', mood: 'late freeway' },
        { id: 'A3', title: 'Last Exit', artist: 'North Arcade', duration: '02:54', mood: 'restless' },
      ],
    },
    {
      id: 'B',
      label: 'Side B',
      accent: '#ffd166',
      tracks: [
        { id: 'B1', title: 'Headlights Low', artist: 'Mara Vale', duration: '03:47', mood: 'soft static' },
        { id: 'B2', title: 'Parking Lot Stars', artist: 'Frame Drift', duration: '04:21', mood: 'slow bloom' },
        { id: 'B3', title: 'Home After One', artist: 'Velvet Mile', duration: '03:03', mood: 'warm return' },
      ],
    },
  ],
};
