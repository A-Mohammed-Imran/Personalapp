import React from 'react';
import { View, Text } from 'react-native';
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
  // Gradient colors based on mode
  const gradientColors: GradientTuple = mode === 'morning'
    ? ['#f59e0b', '#f97316'] // Orange gradient for morning
    : mode === 'planA'
      ? ['#6366f1', '#8b5cf6'] // Indigo to purple for Plan A
      : ['#8b5cf6', '#ec4899']; // Purple to pink for Plan B

  const icon = mode === 'morning' ? 'sunrise' : mode === 'planA' ? 'code' : 'book';

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 24,
        padding: 24,
        shadowColor: gradientColors[0],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold mb-2">{title}</Text>
          <Text className="text-white/80 text-base">{description}</Text>
        </View>

        <View style={{
          backgroundColor: 'rgba(255,255,255,0.25)',
          padding: 14,
          borderRadius: 16,
        }}>
          <Feather name={icon} size={28} color="#ffffff" />
        </View>
      </View>

      {/* Time Status with Glassmorphism */}
      <View style={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
      }}>
        <View className="flex-row items-center">
          <Feather name="clock" size={20} color="#ffffff" />
          <Text className="text-white/70 text-sm ml-2 font-medium">Time Status</Text>
        </View>
        <Text className="text-white text-xl font-bold mt-2">{timeRemaining}</Text>
      </View>
    </LinearGradient>
  );
}
