import { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Colors } from '@/constants/theme';

interface NumberScrollPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  /** Zero-pad the displayed number to this many digits (default 0 = no padding). */
  padStart?: number;
}

/**
 * Custom drum-style number picker that matches the dashboard timer-box look.
 * Swipe up / down to change value.  Uses ScrollView + snapToInterval —
 * no native Picker, no Android default scroll chrome.
 */
const ITEM_HEIGHT = 90;

export default function NumberScrollPicker({
  value,
  onChange,
  min,
  max,
  label,
  padStart = 0,
}: NumberScrollPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const isScrolling = useRef(false);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMounted = useRef(false);

  // ── scroll to value ──────────────────────────────────────────────────────
  // On first mount: instant (no animated flash).  After: animated (e.g. reset).
  useLayoutEffect(() => {
    if (!isScrolling.current) {
      scrollRef.current?.scrollTo({
        y: (value - min) * ITEM_HEIGHT,
        animated: hasMounted.current,
      });
      hasMounted.current = true;
    }
  }, [value, min]);

  // Clean up any pending snap timer on unmount
  useEffect(() => () => { if (snapTimer.current) clearTimeout(snapTimer.current); }, []);

  // ── snap logic ────────────────────────────────────────────────────────────
  const doSnap = useCallback((offset: number) => {
    isScrolling.current = false;
    const index    = Math.round(offset / ITEM_HEIGHT);
    const clamped  = Math.min(max - min, Math.max(0, index));
    onChange(min + clamped);
    // Correct any sub-pixel drift so next scroll starts clean
    const target = clamped * ITEM_HEIGHT;
    if (Math.abs(offset - target) > 0.5) {
      scrollRef.current?.scrollTo({ y: target, animated: true });
    }
  }, [min, max, onChange]);

  const onScrollBeginDrag = useCallback(() => {
    isScrolling.current = true;
    if (snapTimer.current) { clearTimeout(snapTimer.current); snapTimer.current = null; }
  }, []);

  // Primary: fires after scroll momentum decays
  const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (snapTimer.current) { clearTimeout(snapTimer.current); snapTimer.current = null; }
    doSnap(e.nativeEvent.contentOffset.y);
  }, [doSnap]);

  // Fallback: fires when finger lifts with zero momentum.
  // A short timer lets us check whether momentum actually started.
  const onScrollEndDrag = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    snapTimer.current = setTimeout(() => doSnap(offset), 150);
  }, [doSnap]);

  // ── render ────────────────────────────────────────────────────────────────
  const count = max - min + 1;

  return (
    <View style={styles.wrapper}>
      <View style={styles.box}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          bounces={false}
          scrollEventThrottle={16}
          onScrollBeginDrag={onScrollBeginDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
        >
          {Array.from({ length: count }, (_, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.number}>
                {padStart > 0 ? String(min + i).padStart(padStart, '0') : String(min + i)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  box: {
    width: '100%',
    height: ITEM_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 44,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  label: {
    fontSize: 13,
    color: Colors.dark.mutedText,
    marginTop: 8,
  },
});
