import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { ModeType } from '../config/schedule';

interface CurrentStatusProps {
  mode: ModeType;
  title: string;
  description: string;
  timeRemaining: string;
}

type GradientTuple = [string, string];

export default function CurrentStatus({
  mode,
  title,
  description,
  timeRemaining,
}: CurrentStatusProps) {
  const gradientColors: GradientTuple = mode === 'morning'
    ? ['#f59e0b', '#f97316']
    : mode === 'planA'
      ? ['#6366f1', '#4f46e5']
      : ['#ec4899', '#db2777'];

  const icon = mode === 'morning' ? 'sunrise' : mode === 'planA' ? 'code' : 'layers';

  return (
    <View style={styles.container}>
      {/* Subtle Background Glow */}
      <View style={[styles.glow, { backgroundColor: `${gradientColors[0]}10` }]} />

      <View className="flex-row items-start justify-between mb-8">
        <View className="flex-1 mr-4">
          <View className="flex-row items-center mb-3">
            <View style={{ backgroundColor: `${gradientColors[0]}20` }} className="px-3 py-1 rounded-lg border border-white/5">
              <Text className="text-[10px] font-black uppercase tracking-[2px]" style={{ color: gradientColors[0] }}>
                {mode === 'morning' ? 'Morning Optimization' : mode === 'planA' ? 'Core Engineering' : 'Accelerated Path'}
              </Text>
            </View>
          </View>
          <Text className="text-white text-3xl font-black mb-2 tracking-tighter" numberOfLines={2}>
            {title}
          </Text>
          <Text className="text-white/40 text-[13px] leading-5 font-medium">
            {description}
          </Text>
        </View>

        <View style={[styles.iconContainer, { borderColor: `${gradientColors[0]}40` }]}>
          <LinearGradient
            colors={[`${gradientColors[0]}30`, `${gradientColors[0]}10`]}
            className="w-16 h-16 items-center justify-center rounded-2xl"
          >
            <Feather name={icon} size={32} color={gradientColors[0]} />
          </LinearGradient>
        </View>
      </View>

      <View style={styles.timeCard}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full items-center justify-center bg-white/5 mr-3">
              <Feather name="clock" size={14} color="rgba(255,255,255,0.4)" />
            </View>
            <View>
              <Text className="text-white/30 text-[9px] font-black uppercase tracking-widest">Session Time</Text>
              <Text className="text-white/60 text-xs font-bold">Remaining</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-white text-2xl font-black tracking-tighter">{timeRemaining}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 36,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  iconContainer: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  timeCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  }
});
