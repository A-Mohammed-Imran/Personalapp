import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Activity } from '../config/schedule';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const handlePress = async () => {
    if (activity.url) {
      const canOpen = await Linking.canOpenURL(activity.url);
      if (canOpen) {
        await Linking.openURL(activity.url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!activity.url}
      activeOpacity={0.7}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        borderLeftWidth: 5,
        borderLeftColor: activity.bgColor,
        shadowColor: activity.bgColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {/* Icon with colored background */}
          <View
            style={{
              backgroundColor: activity.bgColor,
              padding: 14,
              borderRadius: 14,
              marginRight: 14,
            }}
          >
            <Feather name={activity.icon as any} size={24} color="#ffffff" />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-gray-900 font-bold text-base mb-1">
              {activity.title}
            </Text>
            <Text className="text-gray-600 text-sm" numberOfLines={2}>
              {activity.description}
            </Text>

            {activity.url && (
              <View className="flex-row items-center mt-2">
                <Feather name="link" size={14} color={activity.bgColor} />
                <Text style={{ color: activity.bgColor, fontSize: 12, marginLeft: 4, fontWeight: '600' }}>
                  External Link
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Arrow indicator */}
        {activity.url && (
          <View style={{
            backgroundColor: `${activity.bgColor}15`,
            padding: 10,
            borderRadius: 12,
            marginLeft: 8,
          }}>
            <Feather name="arrow-right" size={20} color={activity.bgColor} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
