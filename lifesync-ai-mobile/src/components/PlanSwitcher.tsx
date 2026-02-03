import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface PlanSwitcherProps {
  currentPlan: 'planA' | 'planB';
  onPlanChange: (plan: 'planA' | 'planB') => void;
  disabled?: boolean;
}

export default function PlanSwitcher({
  currentPlan,
  onPlanChange,
  disabled,
}: PlanSwitcherProps) {
  return (
    <View style={{
      backgroundColor: '#ffffff',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <View className="flex-row items-center mb-3">
        <View style={{
          backgroundColor: '#6366f1',
          padding: 8,
          borderRadius: 10,
          marginRight: 10,
        }}>
          <Feather name="sliders" size={18} color="#ffffff" />
        </View>
        <Text className="text-gray-900 font-bold text-base">Plan Switcher</Text>
      </View>

      <View className="flex-row">
        {/* Plan A Button */}
        <TouchableOpacity
          onPress={() => onPlanChange('planA')}
          disabled={disabled}
          activeOpacity={0.8}
          className="flex-1 mr-2"
        >
          {currentPlan === 'planA' ? (
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 14,
                alignItems: 'center',
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-white font-bold text-base">Plan A</Text>
            </LinearGradient>
          ) : (
            <View style={{
              backgroundColor: '#f3f4f6',
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: 14,
              alignItems: 'center',
            }}>
              <Text className="text-gray-600 font-semibold text-base">Plan A</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Plan B Button */}
        <TouchableOpacity
          onPress={() => onPlanChange('planB')}
          disabled={disabled}
          activeOpacity={0.8}
          className="flex-1 ml-2"
        >
          {currentPlan === 'planB' ? (
            <LinearGradient
              colors={['#8b5cf6', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 14,
                alignItems: 'center',
                shadowColor: '#ec4899',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-white font-bold text-base">Plan B</Text>
            </LinearGradient>
          ) : (
            <View style={{
              backgroundColor: '#f3f4f6',
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: 14,
              alignItems: 'center',
            }}>
              <Text className="text-gray-600 font-semibold text-base">Plan B</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {disabled && (
        <View className="mt-3 flex-row items-center justify-center">
          <Feather name="lock" size={14} color="#f59e0b" />
          <Text className="text-amber-600 text-xs ml-2 font-medium">
            Locked during Morning Mode
          </Text>
        </View>
      )}
    </View>
  );
}
