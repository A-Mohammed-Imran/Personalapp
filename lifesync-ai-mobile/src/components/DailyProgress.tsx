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
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 24,
      overflow: 'hidden',
      shadowColor: config.gradientColors[0],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    }}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={config.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              padding: 12,
              borderRadius: 14,
              marginRight: 14,
            }}>
              <Feather name="trending-up" size={24} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-xl">{config.title}</Text>
              <Text className="text-white/90 text-sm mt-1">{config.subtitle}</Text>
            </View>
          </View>

          {isComplete ? (
            <View style={{
              backgroundColor: '#10b981',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Feather name="check-circle" size={18} color="#ffffff" />
              <Text className="text-white font-bold ml-2 text-sm">Done!</Text>
            </View>
          ) : (
            <View className="items-end">
              <Text className="text-white/80 text-xs font-medium">Remaining</Text>
              <Text className="text-white font-bold text-xl mt-1">{timeRemaining}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Progress Section with White Background */}
      <View style={{ backgroundColor: '#ffffff', padding: 20 }}>
        {/* Time Range */}
        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <Feather name="clock" size={16} color="#9ca3af" />
            <Text className="text-gray-600 text-sm ml-2 font-medium">Start: {startTime}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-600 text-sm mr-2 font-medium">End: {endTime}</Text>
            <Feather name="clock" size={16} color="#9ca3af" />
          </View>
        </View>

        {/* Progress Bar with Gradient */}
        <View style={{
          backgroundColor: '#f3f4f6',
          borderRadius: 16,
          height: 32,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          <LinearGradient
            colors={config.progressColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${Math.min(displayProgress, 100)}%`,
              height: '100%',
            }}
          />
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 14,
              color: displayProgress > 50 ? '#ffffff' : '#374151',
            }}>
              {Math.round(displayProgress)}%
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between mb-4">
          <View style={{
            backgroundColor: '#f0fdf4',
            borderRadius: 16,
            padding: 14,
            flex: 1,
            marginRight: 6,
            alignItems: 'center',
          }}>
            <Feather name="trending-up" size={22} color="#22c55e" />
            <Text className="text-gray-500 text-xs mt-2 font-medium">Progress</Text>
            <Text className="font-bold text-gray-900 text-lg">{Math.round(displayProgress)}%</Text>
          </View>

          <View style={{
            backgroundColor: '#eff6ff',
            borderRadius: 16,
            padding: 14,
            flex: 1,
            marginHorizontal: 6,
            alignItems: 'center',
          }}>
            <Feather name="clock" size={22} color="#3b82f6" />
            <Text className="text-gray-500 text-xs mt-2 font-medium">Status</Text>
            <Text className="font-bold text-gray-900 text-lg">{isComplete ? 'Done' : 'Active'}</Text>
          </View>

          <View style={{
            backgroundColor: '#faf5ff',
            borderRadius: 16,
            padding: 14,
            flex: 1,
            marginLeft: 6,
            alignItems: 'center',
          }}>
            <Feather name="target" size={22} color="#9333ea" />
            <Text className="text-gray-500 text-xs mt-2 font-medium">Goal</Text>
            <Text className="font-bold text-gray-900 text-lg">100%</Text>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={{
          backgroundColor: '#f9fafb',
          borderRadius: 16,
          padding: 14,
          borderLeftWidth: 4,
          borderLeftColor: config.gradientColors[0],
        }}>
          <Text className="text-gray-700 text-sm text-center font-medium">
            {getMotivationalMessage()}
          </Text>
        </View>
      </View>
    </View>
  );
}
