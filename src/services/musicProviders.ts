import { Service, ServiceKey } from '../types/mixtape';

export type ProviderCapability = {
  key: string;
  label: string;
  ready: boolean;
};

export type ProviderScaffold = {
  service: ServiceKey;
  status: 'connected' | 'available' | 'needs_api_setup';
  authType: 'oauth' | 'musickit' | 'manual';
  scopes: string[];
  capabilities: ProviderCapability[];
  nextStep: string;
};

export const providerScaffolds: Record<ServiceKey, ProviderScaffold> = {
  spotify: {
    service: 'spotify',
    status: 'connected',
    authType: 'oauth',
    scopes: ['user-read-email', 'playlist-read-private', 'playlist-modify-private'],
    capabilities: [
      { key: 'search', label: 'Search catalog', ready: false },
      { key: 'importLikes', label: 'Import liked songs', ready: false },
      { key: 'savePlaylist', label: 'Save playlist back to Spotify', ready: false },
    ],
    nextStep: 'Add Spotify OAuth client credentials and token exchange endpoint.',
  },
  apple: {
    service: 'apple',
    status: 'available',
    authType: 'musickit',
    scopes: ['music-user-token', 'library-read', 'playlist-write'],
    capabilities: [
      { key: 'search', label: 'Search Apple Music catalog', ready: false },
      { key: 'library', label: 'Read library and playlists', ready: false },
      { key: 'create', label: 'Create Apple Music playlist', ready: false },
    ],
    nextStep: 'Set up MusicKit JS/native token flow and developer token signing.',
  },
  tidal: {
    service: 'tidal',
    status: 'needs_api_setup',
    authType: 'oauth',
    scopes: ['playlists.read', 'playlists.write', 'search.read'],
    capabilities: [
      { key: 'search', label: 'Search TIDAL catalog', ready: false },
      { key: 'import', label: 'Import favorites', ready: false },
      { key: 'export', label: 'Write mixtape playlist', ready: false },
    ],
    nextStep: 'Register TIDAL app credentials and define OAuth redirect flow.',
  },
};

export const getProviderScaffold = (service: ServiceKey) => providerScaffolds[service];

export const getServiceConnectionSummary = (service: Service) => {
  const scaffold = providerScaffolds[service.key];

  return {
    status: service.connected
      ? 'Connected mock account'
      : scaffold.status === 'needs_api_setup'
        ? 'Needs API setup'
        : 'Ready for connection flow',
    nextStep: scaffold.nextStep,
  };
};
