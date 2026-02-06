import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { URGENT_THRESHOLD_SECS, WARNING_THRESHOLD_SECS } from '@/constants/app';
import { calculateTimeRemaining } from '@/utils/time';

interface CircularTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  size?: number;
}

const STROKE_WIDTH = 12;

const CircularTimer: React.FC<CircularTimerProps> = ({
  remainingSeconds,
  totalSeconds,
  size = 200,
}) => {
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressFraction = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressFraction);

  const strokeColor = useMemo(() => {
    if (remainingSeconds <= URGENT_THRESHOLD_SECS) return Colors.dark.urgentRed;
    if (remainingSeconds <= WARNING_THRESHOLD_SECS) return Colors.dark.statusYellow;
    return Colors.dark.safeGreen;
  }, [remainingSeconds]);

  const time = useMemo(() => calculateTimeRemaining(remainingSeconds * 1000), [remainingSeconds]);
  const hh = String(time.hours).padStart(2, '0');
  const mm = String(time.mins).padStart(2, '0');
  const ss = String(time.secs).padStart(2, '0');

  // Five-column layout: hh : mm : ss  (positions scale with size)
  const hhX      = size * 0.19;
  const colon1X  = size * 0.345;
  const mmX      = size * 0.50;
  const colon2X  = size * 0.655;
  const ssX      = size * 0.81;
  const numY     = size * 0.47;
  const lblY     = size * 0.60;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={Colors.dark.cardBorder}
          strokeWidth={STROKE_WIDTH}
        />
        {/* Progress arc — rotated so it starts from 12 o'clock */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {/* Hours */}
        <SvgText x={hhX} y={numY} textAnchor="middle" fill={Colors.dark.text} fontSize={26} fontWeight="bold">{hh}</SvgText>
        <SvgText x={hhX} y={lblY} textAnchor="middle" fill={Colors.dark.mutedText} fontSize={11}>hr</SvgText>

        {/* Colon 1 */}
        <SvgText x={colon1X} y={numY} textAnchor="middle" fill={Colors.dark.mutedText} fontSize={22} fontWeight="bold">:</SvgText>

        {/* Minutes */}
        <SvgText x={mmX} y={numY} textAnchor="middle" fill={Colors.dark.text} fontSize={26} fontWeight="bold">{mm}</SvgText>
        <SvgText x={mmX} y={lblY} textAnchor="middle" fill={Colors.dark.mutedText} fontSize={11}>min</SvgText>

        {/* Colon 2 */}
        <SvgText x={colon2X} y={numY} textAnchor="middle" fill={Colors.dark.mutedText} fontSize={22} fontWeight="bold">:</SvgText>

        {/* Seconds */}
        <SvgText x={ssX} y={numY} textAnchor="middle" fill={Colors.dark.text} fontSize={26} fontWeight="bold">{ss}</SvgText>
        <SvgText x={ssX} y={lblY} textAnchor="middle" fill={Colors.dark.mutedText} fontSize={11}>sec</SvgText>
      </Svg>
    </View>
  );
};

export default CircularTimer;
