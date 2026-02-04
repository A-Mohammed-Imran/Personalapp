import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Activity } from '../config/schedule';

interface ActivityCardProps {
  activity: Activity;
  isCompleted?: boolean;
  onToggleComplete?: (taskId: string) => void;
  showStreak?: boolean;
  streakCount?: number;
  streakAtRisk?: boolean;
}

export default function ActivityCard({
  activity,
  isCompleted = false,
  onToggleComplete,
  showStreak = false,
  streakCount = 0,
  streakAtRisk = false,
}: ActivityCardProps) {
  const handlePress = async () => {
    try {
      // Try to open with app scheme first (deep link)
      if (activity.appScheme) {
        const canOpenApp = await Linking.canOpenURL(activity.appScheme);
        if (canOpenApp) {
          await Linking.openURL(activity.appScheme);
          return;
        }
      }

      // Fallback to URL (web or app store)
      if (activity.url) {
        const canOpen = await Linking.canOpenURL(activity.url);
        if (canOpen) {
          await Linking.openURL(activity.url);
        } else {
          Alert.alert('Error', 'Cannot open this link');
        }
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Failed to open the app or link');
    }
  };

  const handleCheckboxPress = () => {
    if (onToggleComplete) {
      onToggleComplete(activity.id);
    }
  };

  return (
    <View
      style={{
        backgroundColor: isCompleted ? 'rgba(255, 255, 255, 0.015)' : 'rgba(255, 255, 255, 0.04)',
        borderRadius: 32,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: isCompleted ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Accent Strip */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 24,
          bottom: 24,
          width: 4,
          backgroundColor: isCompleted ? '#10b981' : activity.bgColor,
          borderRadius: 8,
          opacity: isCompleted ? 0.2 : 0.8,
        }}
      />

      <View className="flex-row items-center">
        {/* Checkbox (Mechanical Feel) */}
        <TouchableOpacity
          onPress={handleCheckboxPress}
          activeOpacity={0.7}
          style={{
            width: 32,
            height: 32,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: isCompleted ? '#10b981' : 'rgba(255,255,255,0.12)',
            backgroundColor: isCompleted ? '#10b981' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            marginRight: 18,
          }}
        >
          {isCompleted && <Feather name="check" size={20} color="#ffffff" />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePress}
          disabled={!activity.url && !activity.appScheme}
          activeOpacity={0.7}
          className="flex-row items-center flex-1"
        >
          {/* Enhanced Icon Container */}
          <View
            style={{
              backgroundColor: isCompleted ? 'rgba(255,255,255,0.03)' : `${activity.bgColor}20`,
              width: 56,
              height: 56,
              borderRadius: 20,
              marginRight: 18,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: isCompleted ? 'rgba(255,255,255,0.05)' : `${activity.bgColor}40`,
            }}
          >
            {activity.useAppIcon && activity.appIconUrl ? (
              <Image
                source={typeof activity.appIconUrl === 'string' ? { uri: activity.appIconUrl } : activity.appIconUrl}
                style={{ width: 34, height: 34, opacity: isCompleted ? 0.3 : 1 }}
                resizeMode="contain"
              />
            ) : (
              <Feather
                name={activity.icon as any}
                size={24}
                color={isCompleted ? 'rgba(255,255,255,0.2)' : activity.bgColor}
              />
            )}
          </View>

          {/* Content Stack */}
          <View className="flex-1">
            <Text
              className="text-white font-black text-[18px] tracking-tight mb-1"
              style={{ opacity: isCompleted ? 0.3 : 1 }}
            >
              {activity.title}
            </Text>
            <Text
              className="text-white/40 text-[12px] leading-4 font-bold"
              numberOfLines={1}
              style={{ opacity: isCompleted ? 0.2 : 0.6 }}
            >
              {activity.description}
            </Text>

            {/* Context Badges */}
            <View className="flex-row items-center mt-3">
              {showStreak && streakCount > 0 && (
                <View className="bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/20 mr-2 flex-row items-center">
                  <Feather name="zap" size={10} color={streakAtRisk ? '#ef4444' : '#fbbf24'} />
                  <Text className={`text-[9px] font-black uppercase ml-1.5 ${streakAtRisk ? 'text-red-500' : 'text-amber-400'}`}>
                    {streakCount} Day Streak
                  </Text>
                </View>
              )}

              {(activity.url || activity.appScheme) && !isCompleted && (
                <View className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 flex-row items-center">
                  <Text className="text-white/30 text-[8px] font-black uppercase tracking-widest">
                    {activity.appScheme ? 'Native System' : 'External'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Minimal Action Indicator */}
        {(activity.url || activity.appScheme) && !isCompleted && (
          <View className="pr-1 opacity-20">
            <Feather name="chevron-right" size={18} color="#ffffff" />
          </View>
        )}
      </View>
    </View>
  );
}
