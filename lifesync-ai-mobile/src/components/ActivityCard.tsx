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
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        borderLeftWidth: 5,
        borderLeftColor: isCompleted ? '#10b981' : activity.bgColor,
        shadowColor: activity.bgColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        opacity: isCompleted ? 0.7 : 1,
      }}
    >
      <View className="flex-row items-center justify-between">
        {/* Checkbox */}
        <TouchableOpacity
          onPress={handleCheckboxPress}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: isCompleted ? '#10b981' : activity.bgColor,
            backgroundColor: isCompleted ? '#10b981' : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          {isCompleted && (
            <Feather name="check" size={18} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePress}
          disabled={!activity.url && !activity.appScheme}
          activeOpacity={0.7}
          className="flex-row items-center flex-1"
        >
          {/* Icon with colored background or App Logo */}
          <View
            style={{
              backgroundColor: activity.useAppIcon ? '#ffffff' : activity.bgColor,
              padding: activity.useAppIcon ? 8 : 14,
              borderRadius: 14,
              marginRight: 14,
              borderWidth: activity.useAppIcon ? 1 : 0,
              borderColor: activity.useAppIcon ? '#e5e7eb' : 'transparent',
            }}
          >
            {activity.useAppIcon && activity.appIconUrl ? (
              <Image
                source={typeof activity.appIconUrl === 'string'
                  ? { uri: activity.appIconUrl }
                  : activity.appIconUrl
                }
                style={{ width: 40, height: 40, borderRadius: 8 }}
                resizeMode="contain"
              />
            ) : (
              <Feather name={activity.icon as any} size={24} color="#ffffff" />
            )}
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text
              className="text-gray-900 font-bold text-base mb-1"
              style={{ textDecorationLine: isCompleted ? 'line-through' : 'none' }}
            >
              {activity.title}
            </Text>
            <Text className="text-gray-600 text-sm" numberOfLines={2}>
              {activity.description}
            </Text>

            {/* Streak indicator for LinkedIn */}
            {showStreak && streakCount > 0 && (
              <View className="flex-row items-center mt-2">
                <Feather
                  name="zap"
                  size={14}
                  color={streakAtRisk ? '#ef4444' : '#f59e0b'}
                />
                <Text style={{
                  color: streakAtRisk ? '#ef4444' : '#f59e0b',
                  fontSize: 12,
                  marginLeft: 4,
                  fontWeight: '700'
                }}>
                  {streakCount} day streak {streakAtRisk ? '⚠️ At Risk!' : '🔥'}
                </Text>
              </View>
            )}

            {(activity.url || activity.appScheme) && !showStreak && (
              <View className="flex-row items-center mt-2">
                <Feather
                  name={activity.appScheme ? "smartphone" : "link"}
                  size={14}
                  color={activity.bgColor}
                />
                <Text style={{ color: activity.bgColor, fontSize: 12, marginLeft: 4, fontWeight: '600' }}>
                  {activity.appScheme ? 'Open App' : 'External Link'}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Arrow indicator */}
        {(activity.url || activity.appScheme) && (
          <TouchableOpacity onPress={handlePress}>
            <View style={{
              backgroundColor: `${activity.bgColor}15`,
              padding: 10,
              borderRadius: 12,
              marginLeft: 8,
            }}>
              <Feather name="arrow-right" size={20} color={activity.bgColor} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
