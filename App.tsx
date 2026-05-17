import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { seedTape } from './src/data/seedTape';

const TICK_MS = 1000;

function parseDuration(duration: string) {
  const [minutes, seconds] = duration.split(':').map(Number);

  return minutes * 60 + seconds;
}

function formatProgress(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (safeSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainder}`;
}

export default function App() {
  const [sideIndex, setSideIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeSide = seedTape.sides[sideIndex];
  const featuredTrack = activeSide.tracks[trackIndex];
  const nextTrack = activeSide.tracks[trackIndex + 1] ?? null;
  const featuredTrackDuration = useMemo(() => parseDuration(featuredTrack.duration), [featuredTrack.duration]);
  const progressRatio = elapsedSeconds / featuredTrackDuration;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((currentElapsed) => {
        if (currentElapsed + 1 >= featuredTrackDuration) {
          const isLastTrack = trackIndex === activeSide.tracks.length - 1;

          if (isLastTrack) {
            setIsPlaying(false);
            return featuredTrackDuration;
          }

          setTrackIndex((currentTrackIndex) => currentTrackIndex + 1);
          return 0;
        }

        return currentElapsed + 1;
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [activeSide.tracks.length, featuredTrackDuration, isPlaying, trackIndex]);

  const handleTogglePlayback = () => {
    if (!isPlaying && elapsedSeconds >= featuredTrackDuration) {
      setElapsedSeconds(0);
    }

    setIsPlaying((currentState) => !currentState);
  };

  const handleAdvanceTrack = () => {
    setElapsedSeconds(0);
    setTrackIndex((currentTrackIndex) => {
      if (currentTrackIndex === activeSide.tracks.length - 1) {
        return 0;
      }

      return currentTrackIndex + 1;
    });
  };

  const handleRewindTrack = () => {
    if (elapsedSeconds > 3) {
      setElapsedSeconds(0);
      return;
    }

    setElapsedSeconds(0);
    setTrackIndex((currentTrackIndex) => {
      if (currentTrackIndex === 0) {
        return activeSide.tracks.length - 1;
      }

      return currentTrackIndex - 1;
    });
  };

  const handleFlipSide = () => {
    setSideIndex((currentSideIndex) => (currentSideIndex === 0 ? 1 : 0));
    setTrackIndex(0);
    setElapsedSeconds(0);
  };

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
            <View style={[styles.livePill, isPlaying && styles.livePillPlaying]}>
              <Text style={styles.livePillText}>{isPlaying ? 'Playing' : 'Paused'}</Text>
            </View>
          </View>

          <View style={[styles.cassetteShell, { backgroundColor: seedTape.palette.shell }]}>
            <View style={styles.cassetteWindow}>
              <View style={styles.reelColumn}>
                <View style={[styles.reelOuter, isPlaying && styles.reelOuterActive]}>
                  <View style={styles.reelInner} />
                </View>
                <Text style={styles.reelCaption}>{isPlaying ? 'spin' : 'idle'}</Text>
              </View>
              <View style={styles.tapeBridge}>
                <View style={styles.tapeLine} />
                <Text style={styles.nowPlayingLabel}>{featuredTrack.title}</Text>
                <Text style={styles.nowPlayingMeta}>
                  {featuredTrack.artist} • {featuredTrack.duration}
                </Text>
                <Text style={styles.progressText}>
                  {formatProgress(elapsedSeconds)} / {featuredTrack.duration}
                </Text>
                <View style={styles.progressRail}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, Math.max(6, progressRatio * 100))}%` },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.reelColumn}>
                <View style={[styles.reelOuter, styles.reelOuterRight, isPlaying && styles.reelOuterActive]}>
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
              <View style={[styles.sideBadge, { backgroundColor: activeSide.accent }]}>
                <Text style={styles.sideBadgeText}>{activeSide.label}</Text>
              </View>
            </View>

            <View style={styles.transportRow}>
              <Pressable onPress={handleRewindTrack} style={({ pressed }) => [styles.transportButton, pressed && styles.transportButtonPressed]}>
                <Text style={styles.transportText}>rew</Text>
              </Pressable>
              <Pressable
                onPress={handleTogglePlayback}
                style={({ pressed }) => [
                  styles.transportButton,
                  styles.transportPrimaryButton,
                  pressed && styles.transportButtonPressed,
                ]}
              >
                <Text style={styles.transportText}>{isPlaying ? 'pause' : 'play'}</Text>
              </Pressable>
              <Pressable onPress={handleAdvanceTrack} style={({ pressed }) => [styles.transportButton, pressed && styles.transportButtonPressed]}>
                <Text style={styles.transportText}>ff</Text>
              </Pressable>
              <Pressable onPress={handleFlipSide} style={({ pressed }) => [styles.transportButton, pressed && styles.transportButtonPressed]}>
                <Text style={styles.transportText}>flip</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <Text style={styles.metaEyebrow}>Current vibe</Text>
            <Text style={styles.metaValue}>{featuredTrack.mood}</Text>
            <Text style={styles.metaHint}>
              {isPlaying ? 'Deck is rolling through the current cut.' : 'Playback is paused and ready to resume.'}
            </Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaEyebrow}>Next up</Text>
            <Text style={styles.metaValue}>{nextTrack?.title ?? 'End of side'}</Text>
            <Text style={styles.metaHint}>{nextTrack?.artist ?? 'Flip the tape to keep the session going.'}</Text>
          </View>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listEyebrow}>{activeSide.label} queue</Text>
          {activeSide.tracks.map((track, index) => (
            <View key={track.id} style={[styles.trackRow, index === trackIndex && styles.trackRowActive]}>
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
  livePillPlaying: {
    backgroundColor: 'rgba(255, 209, 102, 0.14)',
    borderColor: 'rgba(255, 209, 102, 0.45)',
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
  reelOuterActive: {
    borderColor: '#f6e4b7',
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
  progressText: {
    color: '#f6e4b7',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  progressRail: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 209, 102, 0.18)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ff7a59',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBadgeText: {
    color: '#1f1912',
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
  transportPrimaryButton: {
    backgroundColor: '#3d291f',
    borderColor: '#ff7a59',
  },
  transportButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
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
