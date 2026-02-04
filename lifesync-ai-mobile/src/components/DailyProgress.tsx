import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { ModeType } from '../config/schedule';

type GradientTuple = [string, string];

interface DailyProgressProps {
  progress: number;
  timeRemaining: string;
  sessionType: ModeType;
  startTime: string;
  endTime: string;
  completedTasks?: number;
  totalTasks?: number;
  taskCompletionPercentage?: number;
}

export default function DailyProgress({
  progress,
  timeRemaining,
  sessionType,
  startTime,
  endTime,
  completedTasks = 0,
  totalTasks = 0,
  taskCompletionPercentage = 0,
}: DailyProgressProps) {
  const getSessionConfig = () => {
    switch (sessionType) {
      case 'morning':
        return {
          title: 'Morning Session',
          subtitle: 'English Language Focus',
          gradientColors: ['#f59e0b', '#f97316'] as GradientTuple,
          progressColors: ['#fbbf24', '#f59e0b'] as GradientTuple,
        };
      case 'planA':
        return {
          title: 'Plan A Progress',
          subtitle: 'LeetCode & Team Collaboration',
          gradientColors: ['#6366f1', '#8b5cf6'] as GradientTuple,
          progressColors: ['#818cf8', '#6366f1'] as GradientTuple,
        };
      case 'planB':
        return {
          title: 'Plan B Progress',
          subtitle: 'Internship & Online Courses',
          gradientColors: ['#8b5cf6', '#ec4899'] as GradientTuple,
          progressColors: ['#a78bfa', '#8b5cf6'] as GradientTuple,
        };
    }
  };

  const config = getSessionConfig();

  // Use task completion percentage if available, otherwise use time-based progress
  const displayProgress = totalTasks > 0 ? taskCompletionPercentage : progress;
  const isComplete = displayProgress >= 100;

  const getMotivationalMessage = () => {
    if (isComplete) return `🎉 All ${totalTasks} tasks complete! Great work!`;
    if (displayProgress < 25) return `🚀 ${completedTasks}/${totalTasks} tasks done! Keep going!`;
    if (displayProgress < 50) return `💪 ${completedTasks}/${totalTasks} completed! You're making progress!`;
    if (displayProgress < 75) return `⭐ ${completedTasks}/${totalTasks} done! Halfway there!`;
    return `🏁 ${completedTasks}/${totalTasks} tasks! Almost done!`;
  };

  return (
    <View style={{
      borderRadius: 28,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    }}>
      {/* Header Info */}
      <View style={{ padding: 24, paddingBottom: 16 }}>
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: 10,
              borderRadius: 16,
              marginRight: 14,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}>
              <Feather name="trending-up" size={20} color={config.gradientColors[0]} />
            </View>
            <View>
              <Text className="text-white font-black text-xl">{config.title}</Text>
              <Text className="text-white/40 text-xs mt-0.5 tracking-tight">{config.subtitle}</Text>
            </View>
          </View>

          {isComplete ? (
            <View className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <Text className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Complete</Text>
            </View>
          ) : (
            <View className="items-end">
              <Text className="text-white/30 text-[9px] font-black uppercase tracking-widest">Session End</Text>
              <Text className="text-white font-bold text-base">{endTime}</Text>
            </View>
          )}
        </View>

        {/* Custom Premium Progress Bar */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 20,
          height: 12,
          width: '100%',
          overflow: 'hidden',
          marginBottom: 10,
        }}>
          <LinearGradient
            colors={config.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${Math.min(displayProgress, 100)}%`,
              height: '100%',
              borderRadius: 20,
            }}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">{Math.round(displayProgress)}% Path Completed</Text>
          <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Target 100%</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={{ padding: 16, paddingTop: 0 }}>
        <View className="flex-row">
          {[
            { label: 'Progress', value: `${Math.round(displayProgress)}%`, icon: 'activity', color: config.gradientColors[0] },
            { label: 'Tasks', value: `${completedTasks}/${totalTasks}`, icon: 'check-circle', color: '#10b981' },
            { label: 'Status', value: isComplete ? 'Peak' : 'Active', icon: 'zap', color: '#f59e0b' }
          ].map((stat, i) => (
            <View key={i} className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 mx-1 items-center">
              <Feather name={stat.icon as any} size={16} color={stat.color} />
              <Text className="text-white/30 text-[8px] font-black uppercase tracking-widest mt-2">{stat.label}</Text>
              <Text className="text-white font-bold text-sm mt-1">{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Motivational Footer */}
      <View className="bg-white/5 p-4 items-center border-t border-white/10">
        <Text className="text-white/60 text-xs font-bold italic text-center">
          {getMotivationalMessage()}
        </Text>
      </View>
    </View>
  );
}
