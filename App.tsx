import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { discoveryTracks, moods, serviceLabel, servicesSeed, tapesSeed } from './src/data/mixtapeData';
import { getProviderScaffold, getServiceConnectionSummary } from './src/services/musicProviders';
import { MoodKey, Service, ServiceKey, TabKey } from './src/types/mixtape';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('tapes');
  const [services, setServices] = useState<Service[]>(servicesSeed);
  const [selectedService, setSelectedService] = useState<ServiceKey>('spotify');
  const [selectedMood, setSelectedMood] = useState<MoodKey>('Late Night');
  const [mixtapeTitle, setMixtapeTitle] = useState('Summer Exit Tape');
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>(['1', '3', '4']);
  const [smartOrderingEnabled, setSmartOrderingEnabled] = useState(true);

  const selectedTracks = useMemo(
    () => discoveryTracks.filter((track) => selectedTrackIds.includes(track.id)),
    [selectedTrackIds],
  );

  const connectedCount = services.filter((service) => service.connected).length;
  const filteredTracks = discoveryTracks.filter((track) => track.service === selectedService);
  const selectedServiceCard = services.find((service) => service.key === selectedService) ?? services[0];
  const selectedProvider = getProviderScaffold(selectedService);

  const toggleTrack = (trackId: string) => {
    setSelectedTrackIds((current) =>
      current.includes(trackId) ? current.filter((id) => id !== trackId) : [...current, trackId],
    );
  };

  const toggleServiceConnection = (serviceKey: ServiceKey) => {
    setServices((current) =>
      current.map((service) =>
        service.key === serviceKey
          ? {
              ...service,
              connected: !service.connected,
            }
          : service,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Mixtape</Text>
            <Text style={styles.headerTitle}>Build a tape from the service you actually use.</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{connectedCount} connected</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'tapes' ? (
            <View style={styles.screenStack}>
              <View style={styles.heroPanel}>
                <Text style={styles.heroKicker}>Ready to share</Text>
                <Text style={styles.heroTitle}>Turn saved songs into a polished digital mixtape.</Text>
                <Text style={styles.heroBody}>
                  Pull in favorites from Spotify, Apple Music, or TIDAL, arrange the flow, and send a tape that feels intentional.
                </Text>
                <View style={styles.heroStatsRow}>
                  <View style={styles.heroStatCard}>
                    <Text style={styles.heroStatValue}>24</Text>
                    <Text style={styles.heroStatLabel}>songs shortlisted</Text>
                  </View>
                  <View style={styles.heroStatCard}>
                    <Text style={styles.heroStatValue}>3</Text>
                    <Text style={styles.heroStatLabel}>services available</Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your tapes</Text>
                <Text style={styles.sectionAction}>Newest first</Text>
              </View>

              {tapesSeed.map((tape) => (
                <View key={tape.id} style={styles.tapeCard}>
                  <View
                    style={[
                      styles.tapeGradient,
                      { backgroundColor: tape.gradient[0] },
                    ]}
                  >
                    <View style={[styles.tapeGradientOrb, { backgroundColor: tape.gradient[1] }]} />
                    <Text style={styles.tapeCardService}>{tape.service}</Text>
                    <Text style={styles.tapeCardTitle}>{tape.title}</Text>
                    <Text style={styles.tapeCardSubtitle}>{tape.subtitle}</Text>
                    <View style={styles.tapeMetaRow}>
                      <Text style={styles.tapeMetaText}>{tape.trackCount} tracks</Text>
                      <Text style={styles.tapeMetaText}>{tape.duration}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {activeTab === 'create' ? (
            <View style={styles.screenStack}>
              <View style={styles.createCard}>
                <Text style={styles.sectionTitle}>Playlist creation</Text>
                <Text style={styles.createBody}>
                  Choose a source, pick the mood, and assemble a tape from realistic mock results until the live APIs are wired in.
                </Text>

                <Text style={styles.fieldLabel}>Tape title</Text>
                <TextInput
                  value={mixtapeTitle}
                  onChangeText={setMixtapeTitle}
                  placeholder="Name your mixtape"
                  placeholderTextColor="#7D7C8F"
                  style={styles.titleInput}
                />

                <Text style={styles.fieldLabel}>Source service</Text>
                <View style={styles.pillRow}>
                  {services.map((service) => {
                    const isSelected = selectedService === service.key;
                    return (
                      <Pressable
                        key={service.key}
                        onPress={() => setSelectedService(service.key)}
                        style={[
                          styles.servicePill,
                          isSelected && { borderColor: service.accent, backgroundColor: '#151723' },
                        ]}
                      >
                        <View style={[styles.serviceDot, { backgroundColor: service.accent }]} />
                        <Text style={styles.servicePillText}>{service.name}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.integrationCard}>
                  <View style={styles.integrationHeader}>
                    <Text style={styles.integrationTitle}>{selectedServiceCard.name} integration scaffold</Text>
                    <Text style={styles.integrationStatus}>{selectedProvider.authType.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.integrationBody}>{selectedProvider.nextStep}</Text>
                  <Text style={styles.integrationScopeLabel}>Planned scopes</Text>
                  <View style={styles.scopeRow}>
                    {selectedProvider.scopes.map((scope) => (
                      <View key={scope} style={styles.scopePill}>
                        <Text style={styles.scopeText}>{scope}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Mood direction</Text>
                <View style={styles.pillRow}>
                  {moods.map((mood) => {
                    const isSelected = selectedMood === mood;
                    return (
                      <Pressable
                        key={mood}
                        onPress={() => setSelectedMood(mood)}
                        style={[styles.moodPill, isSelected && styles.moodPillActive]}
                      >
                        <Text style={[styles.moodPillText, isSelected && styles.moodPillTextActive]}>{mood}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available songs</Text>
                <Text style={styles.sectionAction}>{serviceLabel(selectedService)} mock catalog</Text>
              </View>

              {filteredTracks.map((track) => {
                const selected = selectedTrackIds.includes(track.id);
                return (
                  <Pressable
                    key={track.id}
                    onPress={() => toggleTrack(track.id)}
                    style={[styles.trackCard, selected && styles.trackCardSelected]}
                  >
                    <View style={styles.trackInfo}>
                      <Text style={styles.trackTitle}>{track.title}</Text>
                      <Text style={styles.trackArtist}>{track.artist}</Text>
                      <Text style={styles.trackEnergy}>{track.energy}</Text>
                    </View>
                    <View style={styles.trackMetaCol}>
                      <Text style={styles.trackDuration}>{track.duration}</Text>
                      <Text style={styles.trackSelectState}>{selected ? 'Selected' : 'Add'}</Text>
                    </View>
                  </Pressable>
                );
              })}

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeaderRow}>
                  <View>
                    <Text style={styles.sectionTitle}>Current tape summary</Text>
                    <Text style={styles.summarySubtitle}>{mixtapeTitle}</Text>
                  </View>
                  <View style={styles.switchWrap}>
                    <Text style={styles.switchLabel}>Smart ordering</Text>
                    <Switch value={smartOrderingEnabled} onValueChange={setSmartOrderingEnabled} trackColor={{ true: '#FF7A3D' }} />
                  </View>
                </View>
                <Text style={styles.summaryMeta}>{selectedTracks.length} songs selected • Mood: {selectedMood}</Text>
                {selectedTracks.map((track) => (
                  <View key={track.id} style={styles.summaryRow}>
                    <Text style={styles.summaryTrack}>{track.title}</Text>
                    <Text style={styles.summaryDuration}>{track.duration}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'profile' ? (
            <View style={styles.screenStack}>
              <View style={styles.profileHero}>
                <Text style={styles.profileName}>Steve’s Mixtape Studio</Text>
                <Text style={styles.profileBody}>
                  Control which services are connected, what the app can import, and how your tape-building profile presents itself.
                </Text>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Connected services</Text>
                <Text style={styles.sectionAction}>Tap to toggle mock status</Text>
              </View>

              {services.map((service) => {
                const summary = getServiceConnectionSummary(service);
                const scaffold = getProviderScaffold(service.key);

                return (
                  <Pressable
                    key={service.key}
                    onPress={() => toggleServiceConnection(service.key)}
                    style={styles.connectionCard}
                  >
                    <View style={[styles.connectionStripe, { backgroundColor: service.accent }]} />
                    <View style={styles.connectionCopy}>
                      <Text style={styles.connectionTitle}>{service.name}</Text>
                      <Text style={styles.connectionBody}>{service.description}</Text>
                      <Text style={styles.connectionStatusLine}>{summary.status}</Text>
                      <Text style={styles.connectionNextStep}>{scaffold.nextStep}</Text>
                    </View>
                    <View style={service.connected ? styles.connectedBadge : styles.disconnectedBadge}>
                      <Text style={service.connected ? styles.connectedBadgeText : styles.disconnectedBadgeText}>
                        {service.connected ? 'Connected' : 'Connect'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}

              <View style={styles.preferencesCard}>
                <Text style={styles.sectionTitle}>Import preferences</Text>
                <View style={styles.preferenceRow}>
                  <Text style={styles.preferenceLabel}>Default service</Text>
                  <Text style={styles.preferenceValue}>{selectedServiceCard.name}</Text>
                </View>
                <View style={styles.preferenceRow}>
                  <Text style={styles.preferenceLabel}>Favorite mood</Text>
                  <Text style={styles.preferenceValue}>{selectedMood}</Text>
                </View>
                <View style={styles.preferenceRow}>
                  <Text style={styles.preferenceLabel}>Next live integration target</Text>
                  <Text style={styles.preferenceValue}>Song search + playlist save</Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.tabBar}>
          {[
            ['tapes', 'Tapes'],
            ['create', 'Create'],
            ['profile', 'Profile'],
          ].map(([key, label]) => {
            const typedKey = key as TabKey;
            const selected = activeTab === typedKey;
            return (
              <Pressable
                key={key}
                onPress={() => setActiveTab(typedKey)}
                style={[styles.tabItem, selected && styles.tabItemActive]}
              >
                <Text style={[styles.tabText, selected && styles.tabTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0B10',
  },
  appShell: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 12,
  },
  eyebrow: {
    color: '#8D90A7',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#F5F7FF',
    fontSize: 27,
    fontWeight: '700',
    maxWidth: 260,
    lineHeight: 33,
  },
  headerBadge: {
    backgroundColor: '#171926',
    borderColor: '#262A3D',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  headerBadgeText: {
    color: '#D7DBF0',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  screenStack: {
    gap: 16,
  },
  heroPanel: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: '#11131D',
    borderWidth: 1,
    borderColor: '#23273A',
  },
  heroKicker: {
    color: '#FF8B57',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroBody: {
    color: '#B6BCD5',
    fontSize: 15,
    lineHeight: 22,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#171A27',
    borderWidth: 1,
    borderColor: '#262C42',
    padding: 14,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroStatLabel: {
    color: '#9BA3C2',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#F5F7FF',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionAction: {
    color: '#8A90AA',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
  },
  tapeCard: {
    borderRadius: 26,
    overflow: 'hidden',
  },
  tapeGradient: {
    borderRadius: 26,
    padding: 20,
    minHeight: 176,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  tapeGradientOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    opacity: 0.28,
    right: -36,
    top: -32,
  },
  tapeCardService: {
    color: '#FFF7F2',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  tapeCardTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 18,
  },
  tapeCardSubtitle: {
    color: '#F7EDE7',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: '88%',
  },
  tapeMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  tapeMetaText: {
    color: '#FFF4EE',
    fontSize: 13,
    fontWeight: '600',
  },
  createCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#11131D',
    borderWidth: 1,
    borderColor: '#23273A',
  },
  createBody: {
    color: '#A8AEC7',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 16,
  },
  fieldLabel: {
    color: '#E7EAFA',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  titleInput: {
    backgroundColor: '#171A27',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262C42',
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10131D',
    borderWidth: 1,
    borderColor: '#262C42',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
  },
  serviceDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  servicePillText: {
    color: '#EDF0FF',
    fontSize: 13,
    fontWeight: '600',
  },
  integrationCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#151927',
    borderWidth: 1,
    borderColor: '#29304A',
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  integrationTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  integrationStatus: {
    color: '#FFB08B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  integrationBody: {
    color: '#B6BEDB',
    fontSize: 13,
    lineHeight: 19,
  },
  integrationScopeLabel: {
    color: '#E6EAFA',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  scopeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scopePill: {
    backgroundColor: '#10131D',
    borderColor: '#29304A',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  scopeText: {
    color: '#DCE2F8',
    fontSize: 11,
  },
  moodPill: {
    backgroundColor: '#171A27',
    borderWidth: 1,
    borderColor: '#262C42',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
  },
  moodPillActive: {
    backgroundColor: '#FF7A3D',
    borderColor: '#FF7A3D',
  },
  moodPillText: {
    color: '#D6DBF3',
    fontSize: 13,
    fontWeight: '600',
  },
  moodPillTextActive: {
    color: '#FFFFFF',
  },
  trackCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#11131D',
    borderWidth: 1,
    borderColor: '#23273A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  trackCardSelected: {
    borderColor: '#FF7A3D',
    backgroundColor: '#17131A',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#B7BED9',
    fontSize: 14,
    marginBottom: 4,
  },
  trackEnergy: {
    color: '#8D96B6',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  trackMetaCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  trackDuration: {
    color: '#FFF2EC',
    fontSize: 13,
    fontWeight: '700',
  },
  trackSelectState: {
    color: '#FF9A6E',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#131622',
    borderWidth: 1,
    borderColor: '#23273A',
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  summarySubtitle: {
    color: '#FFB08B',
    fontSize: 14,
    marginTop: 5,
  },
  summaryMeta: {
    color: '#A6ADC8',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#222637',
  },
  summaryTrack: {
    color: '#F2F5FF',
    fontSize: 14,
  },
  summaryDuration: {
    color: '#9FA7C5',
    fontSize: 13,
  },
  switchWrap: {
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    color: '#A2A9C6',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  profileHero: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: '#11131D',
    borderWidth: 1,
    borderColor: '#23273A',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
  },
  profileBody: {
    color: '#AAB1CC',
    fontSize: 15,
    lineHeight: 22,
  },
  connectionCard: {
    borderRadius: 22,
    backgroundColor: '#11131D',
    borderWidth: 1,
    borderColor: '#23273A',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  connectionStripe: {
    width: 6,
    alignSelf: 'stretch',
    borderRadius: 999,
  },
  connectionCopy: {
    flex: 1,
  },
  connectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  connectionBody: {
    color: '#A5ADC9',
    fontSize: 13,
    lineHeight: 19,
  },
  connectionStatusLine: {
    color: '#FFE0D2',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  connectionNextStep: {
    color: '#8D96B6',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  connectedBadge: {
    backgroundColor: '#163221',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  connectedBadgeText: {
    color: '#8FF0AE',
    fontSize: 12,
    fontWeight: '700',
  },
  disconnectedBadge: {
    backgroundColor: '#231924',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disconnectedBadgeText: {
    color: '#FFB69C',
    fontSize: 12,
    fontWeight: '700',
  },
  preferencesCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#11131D',
    borderWidth: 1,
    borderColor: '#23273A',
    gap: 12,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#202437',
  },
  preferenceLabel: {
    color: '#A2A9C6',
    fontSize: 13,
  },
  preferenceValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '48%',
    textAlign: 'right',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#11131D',
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: '#23273A',
  },
  tabItem: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#FF7A3D',
  },
  tabText: {
    color: '#9EA6C7',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
