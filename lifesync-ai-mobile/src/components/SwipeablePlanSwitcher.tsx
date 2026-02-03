import React, { useRef } from 'react';
import { View, Text, Animated, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type GradientTuple = [string, string];

interface SwipeablePlanSwitcherProps {
  currentPlan: 'planA' | 'planB';
  onPlanChange: (plan: 'planA' | 'planB') => void;
  disabled?: boolean;
}

export default function SwipeablePlanSwitcher({
  currentPlan,
  onPlanChange,
  disabled,
}: SwipeablePlanSwitcherProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD && currentPlan === 'planA') {
          onPlanChange('planB');
        } else if (gestureState.dx > SWIPE_THRESHOLD && currentPlan === 'planB') {
          onPlanChange('planA');
        }

        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }).start();
      },
    })
  ).current;

  const rotation = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
    outputRange: ['-3deg', '0deg', '3deg'],
    extrapolate: 'clamp',
  });

  const scale = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
    outputRange: [0.97, 1, 0.97],
    extrapolate: 'clamp',
  });

  const gradientColors: GradientTuple = currentPlan === 'planA'
    ? ['#6366f1', '#8b5cf6']
    : ['#8b5cf6', '#ec4899'];

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      {/* Swipe Hint */}
      {!disabled && (
        <View className="flex-row items-center justify-center mb-3">
          <Feather name="chevrons-left" size={18} color="#9ca3af" />
          <Text className="text-gray-500 text-sm mx-2 font-medium">Swipe to switch plans</Text>
          <Feather name="chevrons-right" size={18} color="#9ca3af" />
        </View>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [
            { translateX },
            { rotate: rotation },
            { scale },
          ],
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            padding: 28,
            shadowColor: gradientColors[0],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          {/* Background indicators */}
          <View style={{ position: 'absolute', left: 20, top: 0, bottom: 0, justifyContent: 'center', opacity: 0.3 }}>
            <Feather name="chevron-left" size={48} color="#ffffff" />
          </View>
          <View style={{ position: 'absolute', right: 20, top: 0, bottom: 0, justifyContent: 'center', opacity: 0.3 }}>
            <Feather name="chevron-right" size={48} color="#ffffff" />
          </View>

          {/* Content */}
          <View className="items-center">
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              padding: 18,
              borderRadius: 20,
              marginBottom: 16,
            }}>
              <Feather
                name={currentPlan === 'planA' ? 'code' : 'book'}
                size={36}
                color="#ffffff"
              />
            </View>

            <Text className="text-white text-3xl font-bold mb-2">
              {currentPlan === 'planA' ? 'Plan A' : 'Plan B'}
            </Text>

            <Text className="text-white/90 text-center text-base font-medium">
              {currentPlan === 'planA'
                ? 'LeetCode & Team Collaboration'
                : 'Internship & Online Courses'}
            </Text>

            {/* Plan indicators */}
            <View className="flex-row mt-5">
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 4,
                  backgroundColor: currentPlan === 'planA' ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
              />
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 4,
                  backgroundColor: currentPlan === 'planB' ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
              />
            </View>
          </View>

          {disabled && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ backgroundColor: '#fbbf24', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
                <Text className="text-white font-bold text-sm">
                  🌅 Morning Mode Active
                </Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Current Plan Label */}
      <View className="flex-row justify-between mt-3 px-2">
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: currentPlan === 'planA' ? '#6366f1' : '#9ca3af',
        }}>
          ← Plan A
        </Text>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: currentPlan === 'planB' ? '#ec4899' : '#9ca3af',
        }}>
          Plan B →
        </Text>
      </View>
    </View>
  );
}
