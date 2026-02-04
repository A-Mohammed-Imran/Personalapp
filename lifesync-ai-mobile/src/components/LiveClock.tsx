import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface LiveClockProps {
  currentTime: string;
  isMorningMode: boolean;
}

export default function LiveClock({ currentTime, isMorningMode }: LiveClockProps) {
  const [time, ampm] = currentTime.split(' ');
  const modeLabel = isMorningMode ? 'Morning System' : 'Standard Routine';

  return (
    <View style={styles.container}>
      <View>
        <View className="flex-row items-center mb-1">
          <View className={`w-1 h-1 rounded-full mr-2 ${isMorningMode ? 'bg-amber-400' : 'bg-indigo-400'}`} />
          <Text className="text-white/30 text-[10px] font-black uppercase tracking-[2px]">{modeLabel}</Text>
        </View>
        <View className="flex-row items-baseline">
          <Text className="text-white text-6xl font-black tracking-tighter" style={styles.timeText}>{time}</Text>
          <Text className="text-indigo-500 text-xl font-black ml-2 uppercase tracking-tight">{ampm}</Text>
        </View>
      </View>

      <View style={styles.indicatorCard}>
        <LinearGradient
          colors={isMorningMode ? ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)'] : ['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.05)']}
          className="w-20 h-20 items-center justify-center rounded-[28px] border border-white/5"
        >
          <Feather
            name={isMorningMode ? 'sun' : 'zap'}
            size={32}
            color={isMorningMode ? '#f59e0b' : '#818cf8'}
          />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    letterSpacing: -2,
    includeFontPadding: false,
    lineHeight: 70,
  },
  indicatorCard: {
    marginLeft: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  }
});
