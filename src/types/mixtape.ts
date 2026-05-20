export type TabKey = 'tapes' | 'create' | 'profile';
export type ServiceKey = 'spotify' | 'apple' | 'tidal';
export type MoodKey = 'Late Night' | 'Road Trip' | 'Soft Launch' | 'After Hours';

export type Service = {
  key: ServiceKey;
  name: string;
  accent: string;
  description: string;
  connected: boolean;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  service: ServiceKey;
  duration: string;
  energy: string;
};

export type Tape = {
  id: string;
  title: string;
  subtitle: string;
  service: string;
  trackCount: number;
  duration: string;
  gradient: [string, string];
};
