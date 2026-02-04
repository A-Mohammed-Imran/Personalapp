import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface LiveClockProps {
  currentTime: string;
  isMorningMode: boolean;
}

export default function LiveClock({ currentTime, isMorningMode }: LiveClockProps) {
  const icon = isMorningMode ? 'moon' : 'sun';
  const iconColor = '#fbbf24';

  return (
    <LinearGradient
      colors={['#1e293b', '#334155']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-white/70 text-sm font-medium mb-1">Current Time</Text>
          <Text className="text-white text-4xl font-bold">{currentTime}</Text>
        </View>

        <View style={{
          backgroundColor: 'rgba(251, 191, 36, 0.2)',
          padding: 16,
          borderRadius: 16,
        }}>
          <Feather name={icon} size={32} color={iconColor} />
        </View>
      </View>

      <View className="mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
        <View className="flex-row items-center">
          <Feather name="clock" size={16} color="rgba(255,255,255,0.5)" />
          <Text className="text-white/70 text-sm ml-2">
            {isMorningMode ? 'Morning Mode' : 'Work Mode'}
          </Text>
          <Text className="text-white/50 text-sm ml-auto">
            {isMorningMode ? 'Before 6:30 AM' : 'After 6:30 AM'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
