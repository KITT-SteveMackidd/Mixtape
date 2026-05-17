import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
  const [progressRailWidth, setProgressRailWidth] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isSideComplete, setIsSideComplete] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const shouldResumeAfterFlipRef = useRef(false);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reelSpin = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const tensionAnimation = useRef(new Animated.Value(0)).current;
  const hasMountedRef = useRef(false);
  const previousTrackRef = useRef({ sideIndex: 0, trackIndex: 0 });

  const activeSide = seedTape.sides[sideIndex];
  const upcomingSide = seedTape.sides[sideIndex === 0 ? 1 : 0];
  const featuredTrack = activeSide.tracks[trackIndex];
  const nextTrack = activeSide.tracks[trackIndex + 1] ?? null;
  const featuredTrackDuration = useMemo(() => parseDuration(featuredTrack.duration), [featuredTrack.duration]);
  const progressRatio = elapsedSeconds / featuredTrackDuration;
  const boundedProgressRatio = Math.min(1, Math.max(0, progressRatio || 0));
  const reelRotation = reelSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const reverseReelRotation = reelSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
  const animatedProgressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['6%', '100%'],
  });
  const flipRotation = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  const flipScale = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.92, 1],
  });
  const flipOverlayOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.15, 0.5, 0.85, 1],
    outputRange: [0, 0.5, 0.85, 0.5, 0],
  });
  const leftReelTensionScale = tensionAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0.95, 1],
  });
  const rightReelTensionScale = tensionAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 1.08, 1],
  });
  const tapeLineTensionScale = tensionAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0.9, 1],
  });
  const tapeLineTensionOpacity = tensionAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0.6, 1, 0.6],
  });
  const tapeBridgeTensionShift = tensionAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 4, 0],
  });

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((currentElapsed) => {
        if (currentElapsed + 1 >= featuredTrackDuration) {
          const isLastTrack = trackIndex === activeSide.tracks.length - 1;

          if (isLastTrack) {
            shouldResumeAfterFlipRef.current = true;
            setIsPlaying(false);
            setIsSideComplete(true);
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

  useEffect(() => {
    if (!isPlaying) {
      reelSpin.stopAnimation();
      reelSpin.setValue(0);
      return;
    }

    reelSpin.setValue(0);

    const loop = Animated.loop(
      Animated.timing(reelSpin, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => loop.stop();
  }, [isPlaying, reelSpin]);

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: boundedProgressRatio,
      duration: isPlaying ? 450 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [boundedProgressRatio, isPlaying, progressAnimation]);

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const previousTrack = previousTrackRef.current;
    const didTrackChange = previousTrack.sideIndex === sideIndex && previousTrack.trackIndex !== trackIndex;

    if (hasMountedRef.current && didTrackChange && !isFlipping) {
      tensionAnimation.stopAnimation();
      tensionAnimation.setValue(0);
      Animated.sequence([
        Animated.timing(tensionAnimation, {
          toValue: 1,
          duration: 170,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tensionAnimation, {
          toValue: 0,
          duration: 220,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }

    previousTrackRef.current = { sideIndex, trackIndex };
    hasMountedRef.current = true;
  }, [isFlipping, sideIndex, tensionAnimation, trackIndex]);

  const handleTogglePlayback = () => {
    if (isFlipping) {
      return;
    }

    if (!isPlaying && elapsedSeconds >= featuredTrackDuration) {
      setElapsedSeconds(0);
      setIsSideComplete(false);
    }

    setIsPlaying((currentState) => {
      const nextState = !currentState;

      if (!nextState) {
        shouldResumeAfterFlipRef.current = false;
      }

      return nextState;
    });
  };

  const handleAdvanceTrack = () => {
    if (isFlipping) {
      return;
    }

    shouldResumeAfterFlipRef.current = false;
    setElapsedSeconds(0);
    setIsSideComplete(false);
    setTrackIndex((currentTrackIndex) => {
      if (currentTrackIndex === activeSide.tracks.length - 1) {
        return 0;
      }

      return currentTrackIndex + 1;
    });
  };

  const handleRewindTrack = () => {
    if (isFlipping) {
      return;
    }

    shouldResumeAfterFlipRef.current = false;
    setIsSideComplete(false);

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
    if (isFlipping) {
      return;
    }

    const shouldResumePlayback = isPlaying || shouldResumeAfterFlipRef.current;

    setIsFlipping(true);
    setIsPlaying(false);
    flipAnimation.setValue(0);

    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 650,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        setIsFlipping(false);
        return;
      }

      setIsFlipping(false);
      setIsPlaying(shouldResumePlayback);
      flipAnimation.setValue(0);
    });

    flipTimeoutRef.current = setTimeout(() => {
      setSideIndex((currentSideIndex) => (currentSideIndex === 0 ? 1 : 0));
      setTrackIndex(0);
      setElapsedSeconds(0);
      setIsSideComplete(false);
      shouldResumeAfterFlipRef.current = false;
      flipTimeoutRef.current = null;
    }, 325);
  };

  const handleSelectTrack = (selectedTrackIndex: number) => {
    if (isFlipping) {
      return;
    }

    shouldResumeAfterFlipRef.current = false;
    setTrackIndex(selectedTrackIndex);
    setElapsedSeconds(0);
    setIsSideComplete(false);
  };

  const updateScrubPosition = (locationX: number) => {
    if (progressRailWidth <= 0) {
      return;
    }

    const nextRatio = Math.min(1, Math.max(0, locationX / progressRailWidth));
    const nextElapsed = Math.round(nextRatio * featuredTrackDuration);

    setElapsedSeconds(Math.min(featuredTrackDuration, Math.max(0, nextElapsed)));
  };

  const handleProgressRailLayout = (event: LayoutChangeEvent) => {
    setProgressRailWidth(event.nativeEvent.layout.width);
  };

  const handleScrubGrant = (event: GestureResponderEvent) => {
    setIsScrubbing(true);
    updateScrubPosition(event.nativeEvent.locationX);
  };

  const handleScrubMove = (event: GestureResponderEvent) => {
    updateScrubPosition(event.nativeEvent.locationX);
  };

  const handleScrubRelease = () => {
    setIsScrubbing(false);
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
            <View
              style={[
                styles.livePill,
                isPlaying && styles.livePillPlaying,
                isSideComplete && styles.livePillComplete,
              ]}
            >
              <Text style={styles.livePillText}>{isSideComplete ? 'Side complete' : isPlaying ? 'Playing' : 'Paused'}</Text>
            </View>
          </View>

          <Animated.View
            style={[
              styles.cassetteShell,
              { backgroundColor: seedTape.palette.shell },
              isFlipping && {
                transform: [{ perspective: 1200 }, { rotateY: flipRotation }, { scale: flipScale }],
              },
            ]}
          >
            <View style={styles.cassetteWindow}>
              <View style={styles.reelColumn}>
                <Animated.View
                  style={[
                    styles.reelOuter,
                    isPlaying && styles.reelOuterActive,
                    { transform: [{ rotate: reelRotation }, { scale: leftReelTensionScale }] },
                  ]}
                >
                  <View style={styles.reelInner} />
                </Animated.View>
                <Text style={styles.reelCaption}>{isPlaying ? 'spin' : 'idle'}</Text>
              </View>
              <Animated.View style={[styles.tapeBridge, { transform: [{ translateX: tapeBridgeTensionShift }] }]}>
                <Animated.View style={[styles.tapeLine, { opacity: tapeLineTensionOpacity, transform: [{ scaleX: tapeLineTensionScale }] }]} />
                <Text style={styles.nowPlayingLabel}>{featuredTrack.title}</Text>
                <Text style={styles.nowPlayingMeta}>
                  {featuredTrack.artist} • {featuredTrack.duration}
                </Text>
                <Text style={styles.progressText}>
                  {formatProgress(elapsedSeconds)} / {featuredTrack.duration}
                </Text>
                <View
                  style={styles.progressRailTouchTarget}
                  onLayout={handleProgressRailLayout}
                  onMoveShouldSetResponder={() => true}
                  onResponderGrant={handleScrubGrant}
                  onResponderMove={handleScrubMove}
                  onResponderRelease={handleScrubRelease}
                  onResponderTerminate={handleScrubRelease}
                  onStartShouldSetResponder={() => true}
                >
                  <View style={styles.progressRail}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        isPlaying && styles.progressFillPlaying,
                        { width: animatedProgressWidth },
                      ]}
                    />
                  </View>
                  <View
                    pointerEvents="none"
                    style={[
                      styles.progressThumb,
                      isScrubbing && styles.progressThumbActive,
                      {
                        left: `${boundedProgressRatio * 100}%`,
                      },
                    ]}
                  />
                </View>
              </Animated.View>
              <View style={styles.reelColumn}>
                <Animated.View
                  style={[
                    styles.reelOuter,
                    styles.reelOuterRight,
                    isPlaying && styles.reelOuterActive,
                    { transform: [{ rotate: reverseReelRotation }, { scale: rightReelTensionScale }] },
                  ]}
                >
                  <View style={styles.reelInner} />
                </Animated.View>
                <Text style={styles.reelCaption}>{activeSide.label.toLowerCase()}</Text>
              </View>
            </View>

            <Animated.View pointerEvents="none" style={[styles.flipOverlay, { opacity: flipOverlayOpacity }]}>
              <Text style={styles.flipOverlayText}>Flipping to {upcomingSide.label}</Text>
            </Animated.View>

            <View style={[styles.labelStrip, { backgroundColor: seedTape.palette.label }]}>
              <View>
                <Text style={[styles.labelTitle, { color: seedTape.palette.ink }]}>{seedTape.title}</Text>
                <Text style={[styles.labelSubtitle, { color: seedTape.palette.ink }]}>private deck preview</Text>
              </View>
              <View style={[styles.sideBadge, { backgroundColor: activeSide.accent }]}>
                <Text style={styles.sideBadgeText}>{activeSide.label}</Text>
              </View>
            </View>

            {isSideComplete ? (
              <Pressable
                disabled={isFlipping}
                onPress={handleFlipSide}
                style={({ pressed }) => [
                  styles.sideCompleteCard,
                  isFlipping && styles.transportButtonDisabled,
                  pressed && styles.transportButtonPressed,
                ]}
              >
                <Text style={styles.sideCompleteEyebrow}>{activeSide.label} wrapped</Text>
                <Text style={styles.sideCompleteTitle}>Flip to {upcomingSide.label}</Text>
                <Text style={styles.sideCompleteHint}>Last track finished. Tap once to load the next side.</Text>
              </Pressable>
            ) : null}

            <View style={styles.transportRow}>
              <Pressable disabled={isFlipping} onPress={handleRewindTrack} style={({ pressed }) => [styles.transportButton, isFlipping && styles.transportButtonDisabled, pressed && styles.transportButtonPressed]}>
                <Text style={styles.transportText}>rew</Text>
              </Pressable>
              <Pressable
                disabled={isFlipping}
                onPress={handleTogglePlayback}
                style={({ pressed }) => [
                  styles.transportButton,
                  styles.transportPrimaryButton,
                  isFlipping && styles.transportButtonDisabled,
                  pressed && styles.transportButtonPressed,
                ]}
              >
                <Text style={styles.transportText}>{isPlaying ? 'pause' : 'play'}</Text>
              </Pressable>
              <Pressable disabled={isFlipping} onPress={handleAdvanceTrack} style={({ pressed }) => [styles.transportButton, isFlipping && styles.transportButtonDisabled, pressed && styles.transportButtonPressed]}>
                <Text style={styles.transportText}>ff</Text>
              </Pressable>
              <Pressable
                disabled={isFlipping}
                onPress={handleFlipSide}
                style={({ pressed }) => [
                  styles.transportButton,
                  isSideComplete && styles.transportFlipButtonReady,
                  isFlipping && styles.transportButtonDisabled,
                  pressed && styles.transportButtonPressed,
                ]}
              >
                <Text style={styles.transportText}>{isFlipping ? 'flipping…' : isSideComplete ? `flip ${upcomingSide.label.toLowerCase()}` : 'flip'}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <Text style={styles.metaEyebrow}>Current vibe</Text>
            <Text style={styles.metaValue}>{featuredTrack.mood}</Text>
            <Text style={styles.metaHint}>
              {isFlipping
                ? `The deck is turning over to ${upcomingSide.label.toLowerCase()}.`
                : isPlaying
                  ? 'Deck is rolling through the current cut.'
                  : 'Playback is paused and ready to resume.'}
            </Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaEyebrow}>Next up</Text>
            <Text style={styles.metaValue}>{isSideComplete ? `Ready for ${upcomingSide.label}` : nextTrack?.title ?? 'End of side'}</Text>
            <Text style={styles.metaHint}>
              {isSideComplete
                ? 'The deck is paused at the leader. Flip the cassette to keep listening.'
                : nextTrack?.artist ?? 'Flip the tape to keep the session going.'}
            </Text>
          </View>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listEyebrow}>{activeSide.label} queue</Text>
          {activeSide.tracks.map((track, index) => (
            <Pressable
              key={track.id}
              onPress={() => handleSelectTrack(index)}
              style={({ pressed }) => [
                styles.trackRow,
                index === trackIndex && styles.trackRowActive,
                pressed && styles.trackRowPressed,
              ]}
            >
              <View>
                <Text style={styles.trackIndex}>{track.id}</Text>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackMeta}>{track.artist}</Text>
              </View>
              <Text style={styles.trackDuration}>{track.duration}</Text>
            </Pressable>
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
  livePillComplete: {
    backgroundColor: 'rgba(129, 230, 161, 0.14)',
    borderColor: 'rgba(129, 230, 161, 0.45)',
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
  flipOverlay: {
    position: 'absolute',
    top: 18,
    right: 18,
    left: 18,
    zIndex: 2,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(18, 15, 20, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 102, 0.28)',
    alignItems: 'center',
  },
  flipOverlayText: {
    color: '#fff7ea',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
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
  progressRailTouchTarget: {
    justifyContent: 'center',
    paddingVertical: 8,
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
  progressFillPlaying: {
    shadowColor: '#ff7a59',
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  progressThumb: {
    position: 'absolute',
    top: '50%',
    width: 14,
    height: 14,
    borderRadius: 999,
    marginLeft: -7,
    marginTop: -7,
    backgroundColor: '#fff7ea',
    borderWidth: 2,
    borderColor: '#ff7a59',
    shadowColor: '#120f14',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  progressThumbActive: {
    transform: [{ scale: 1.08 }],
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
  sideCompleteCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(129, 230, 161, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(129, 230, 161, 0.42)',
    gap: 4,
  },
  sideCompleteEyebrow: {
    color: '#9fe0b0',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  sideCompleteTitle: {
    color: '#fff7ea',
    fontSize: 18,
    fontWeight: '700',
  },
  sideCompleteHint: {
    color: '#d3f0db',
    fontSize: 13,
    lineHeight: 18,
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
  transportFlipButtonReady: {
    backgroundColor: 'rgba(129, 230, 161, 0.18)',
    borderColor: 'rgba(129, 230, 161, 0.5)',
  },
  transportButtonDisabled: {
    opacity: 0.58,
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
  trackRowPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
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
