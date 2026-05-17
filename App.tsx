import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { seedTape } from './src/data/seedTape';

const activeSide = seedTape.sides[0];
const featuredTrack = activeSide.tracks[0];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>Mixtape mobile</Text>
          <Text style={styles.title}>{seedTape.title}</Text>
          <Text style={styles.note}>{seedTape.note}</Text>
        </View>

        <View style={styles.deckCard}>
          <View style={styles.deckTopRow}>
            <View>
              <Text style={styles.deckLabel}>Loaded tape</Text>
              <Text style={styles.deckCreator}>Made by {seedTape.creator}</Text>
            </View>
            <View style={styles.livePill}>
              <Text style={styles.livePillText}>Seeded demo</Text>
            </View>
          </View>

          <View style={[styles.cassetteShell, { backgroundColor: seedTape.palette.shell }]}>
            <View style={styles.cassetteWindow}>
              <View style={styles.reelColumn}>
                <View style={styles.reelOuter}>
                  <View style={styles.reelInner} />
                </View>
                <Text style={styles.reelCaption}>play</Text>
              </View>
              <View style={styles.tapeBridge}>
                <View style={styles.tapeLine} />
                <Text style={styles.nowPlayingLabel}>{featuredTrack.title}</Text>
                <Text style={styles.nowPlayingMeta}>
                  {featuredTrack.artist} • {featuredTrack.duration}
                </Text>
              </View>
              <View style={styles.reelColumn}>
                <View style={[styles.reelOuter, styles.reelOuterRight]}>
                  <View style={styles.reelInner} />
                </View>
                <Text style={styles.reelCaption}>{activeSide.label.toLowerCase()}</Text>
              </View>
            </View>

            <View style={[styles.labelStrip, { backgroundColor: seedTape.palette.label }]}>
              <View>
                <Text style={[styles.labelTitle, { color: seedTape.palette.ink }]}>{seedTape.title}</Text>
                <Text style={[styles.labelSubtitle, { color: seedTape.palette.ink }]}>private deck preview</Text>
              </View>
              <View style={styles.sideBadge}>
                <Text style={styles.sideBadgeText}>{activeSide.label}</Text>
              </View>
            </View>

            <View style={styles.transportRow}>
              {['rew', 'play', 'ff', 'flip'].map((item) => (
                <View key={item} style={styles.transportButton}>
                  <Text style={styles.transportText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <Text style={styles.metaEyebrow}>Current vibe</Text>
            <Text style={styles.metaValue}>{featuredTrack.mood}</Text>
            <Text style={styles.metaHint}>One focal state, tactile visuals, no playback logic yet.</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaEyebrow}>Next up</Text>
            <Text style={styles.metaValue}>{activeSide.tracks[1].title}</Text>
            <Text style={styles.metaHint}>{activeSide.tracks[1].artist}</Text>
          </View>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listEyebrow}>{activeSide.label} queue</Text>
          {activeSide.tracks.map((track, index) => (
            <View key={track.id} style={[styles.trackRow, index === 0 && styles.trackRowActive]}>
              <View>
                <Text style={styles.trackIndex}>{track.id}</Text>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackMeta}>{track.artist}</Text>
              </View>
              <Text style={styles.trackDuration}>{track.duration}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#120f14',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 18,
  },
  heroCard: {
    borderRadius: 24,
    padding: 22,
    backgroundColor: '#1d1821',
    borderWidth: 1,
    borderColor: '#2f2735',
  },
  kicker: {
    color: '#b8a8c8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: '#fff7ea',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  note: {
    color: '#d3c6d9',
    lineHeight: 21,
    fontSize: 15,
  },
  deckCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#231c28',
    borderWidth: 1,
    borderColor: '#3b3142',
    gap: 16,
  },
  deckTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  deckLabel: {
    color: '#b8a8c8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  deckCreator: {
    color: '#f4ecff',
    fontSize: 18,
    fontWeight: '600',
  },
  livePill: {
    borderRadius: 999,
    backgroundColor: 'rgba(255, 122, 89, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 89, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  livePillText: {
    color: '#ffd4c9',
    fontSize: 12,
    fontWeight: '600',
  },
  cassetteShell: {
    borderRadius: 26,
    padding: 16,
    gap: 14,
  },
  cassetteWindow: {
    backgroundColor: '#3c3226',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  reelColumn: {
    alignItems: 'center',
    gap: 8,
  },
  reelOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 8,
    borderColor: '#5f5140',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f1912',
  },
  reelOuterRight: {
    borderColor: '#6d5b46',
  },
  reelInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#d8c8a7',
  },
  reelCaption: {
    color: '#f3e8d2',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  tapeBridge: {
    flex: 1,
    minHeight: 100,
    borderRadius: 16,
    backgroundColor: '#151116',
    borderWidth: 1,
    borderColor: '#574735',
    padding: 14,
    justifyContent: 'center',
  },
  tapeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    backgroundColor: 'rgba(255, 209, 102, 0.35)',
  },
  nowPlayingLabel: {
    color: '#fff7ea',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  nowPlayingMeta: {
    color: '#d4c5aa',
    fontSize: 13,
  },
  labelStrip: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  labelTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  labelSubtitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.7,
    marginTop: 4,
  },
  sideBadge: {
    minWidth: 66,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f1912',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBadgeText: {
    color: '#f8edd5',
    fontWeight: '700',
  },
  transportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  transportButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#2a2118',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5f5140',
  },
  transportText: {
    color: '#f8edd5',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metaCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#1d1821',
    borderWidth: 1,
    borderColor: '#2f2735',
    gap: 6,
  },
  metaEyebrow: {
    color: '#b8a8c8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  metaValue: {
    color: '#fff7ea',
    fontSize: 18,
    fontWeight: '700',
  },
  metaHint: {
    color: '#d3c6d9',
    fontSize: 13,
    lineHeight: 18,
  },
  listCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#1d1821',
    borderWidth: 1,
    borderColor: '#2f2735',
    gap: 12,
  },
  listEyebrow: {
    color: '#b8a8c8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
  },
  trackRow: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#251e2b',
    borderWidth: 1,
    borderColor: '#352c3d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  trackRowActive: {
    borderColor: 'rgba(255, 122, 89, 0.55)',
    backgroundColor: 'rgba(255, 122, 89, 0.08)',
  },
  trackIndex: {
    color: '#ffb59f',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  trackTitle: {
    color: '#fff7ea',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackMeta: {
    color: '#cfc0d6',
    fontSize: 13,
  },
  trackDuration: {
    color: '#f6e4b7',
    fontSize: 13,
    fontWeight: '700',
  },
});
