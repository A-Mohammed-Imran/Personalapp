import React, { useRef } from 'react';
import { View, Text, Animated, Dimensions, PanResponder, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.22;
const MAX_DRAG = SCREEN_WIDTH * 0.4;

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
  const opacity = useRef(new Animated.Value(1)).current;
  const thresholdCrossed = useRef(false);

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
      speed: 12,
    }).start();
  };

  const triggerTransition = (newPlan: 'planA' | 'planB') => {
    Animated.timing(opacity, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      onPlanChange(newPlan);
      translateX.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !disabled && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        if (Math.abs(newX) > MAX_DRAG) {
          const extra = Math.abs(newX) - MAX_DRAG;
          newX = (newX > 0 ? 1 : -1) * (MAX_DRAG + extra * 0.3);
        }
        translateX.setValue(newX);

        const crossed = Math.abs(gestureState.dx) > SWIPE_THRESHOLD;
        if (crossed && !thresholdCrossed.current) {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          thresholdCrossed.current = true;
        } else if (!crossed && thresholdCrossed.current) {
          thresholdCrossed.current = false;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        thresholdCrossed.current = false;
        const isSwipeLeft = gestureState.dx < -SWIPE_THRESHOLD || gestureState.vx < -0.5;
        const isSwipeRight = gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5;

        if (isSwipeLeft && currentPlan === 'planA') {
          triggerTransition('planB');
        } else if (isSwipeRight && currentPlan === 'planB') {
          triggerTransition('planA');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const rotation = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-5deg', '0deg', '5deg'],
    extrapolate: 'clamp',
  });

  const scale = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.95, 1, 0.95],
    extrapolate: 'clamp',
  });

  const gradientColors: GradientTuple = currentPlan === 'planA'
    ? ['#6366f1', '#8b5cf6']
    : ['#8b5cf6', '#ec4899'];

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Swipe Hint */}
      {!disabled && (
        <View className="flex-row items-center justify-center mb-4">
          <Animated.View
            style={{ opacity: translateX.interpolate({ inputRange: [-50, 0, 50], outputRange: [1, 0.4, 1], extrapolate: 'clamp' }) }}
            className="flex-row items-center"
          >
            <Feather name="chevrons-left" size={12} color="#9ca3af" />
            <Text className="text-gray-500 text-[10px] font-black uppercase tracking-widest mx-4">Swipe to switch</Text>
            <Feather name="chevrons-right" size={12} color="#9ca3af" />
          </Animated.View>
        </View>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          opacity,
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
            borderRadius: 36,
            padding: 28,
            minHeight: 140,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.25)',
            shadowColor: gradientColors[0],
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.5,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Background Pattern */}
          <View style={{ position: 'absolute', right: -30, top: -30, opacity: 0.08 }}>
            <Feather name="zap" size={180} color="#ffffff" />
          </View>

          {/* Content */}
          <View className="flex-row items-center">
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              width: 76,
              height: 76,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}>
              <Feather
                name={currentPlan === 'planA' ? 'code' : 'book'}
                size={38}
                color="#ffffff"
              />
            </View>

            <View className="ml-6 flex-1">
              <View className="flex-row items-center mb-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-white mr-2 shadow-[0_0_5px_#fff]" />
                <Text className="text-white text-[10px] font-black uppercase tracking-[0.25em] opacity-70">Active Strategy</Text>
              </View>
              <Text className="text-white text-3xl font-black tracking-tighter">
                {currentPlan === 'planA' ? 'Plan Alpha' : 'Plan Beta'}
              </Text>
              <Text className="text-white/80 text-[13px] font-bold mt-1.5" numberOfLines={1}>
                {currentPlan === 'planA'
                  ? 'LeetCode & Team Systems'
                  : 'Internship & Research'}
              </Text>
            </View>

            <View className="opacity-40 ml-2">
              <Feather name="repeat" size={18} color="#ffffff" />
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
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 36,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="sun" size={14} color="#000000" />
                <Text style={{ color: '#000000', fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginLeft: 8 }}>
                  Morning Optimization Active
                </Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Current Plan Label */}
      <View className="flex-row justify-between mt-5 px-6">
        <View className="flex-row items-center">
          <View className={`w-1.5 h-1.5 rounded-full mr-2 ${currentPlan === 'planA' ? 'bg-indigo-500' : 'bg-white/10'}`} />
          <Text style={{
            fontSize: 10,
            fontWeight: '900',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: currentPlan === 'planA' ? '#818cf8' : 'rgba(255,255,255,0.2)',
          }}>
            Alpha
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text style={{
            fontSize: 10,
            fontWeight: '900',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: currentPlan === 'planB' ? '#f472b6' : 'rgba(255,255,255,0.2)',
          }}>
            Beta
          </Text>
          <View className={`w-1.5 h-1.5 rounded-full ml-2 ${currentPlan === 'planB' ? 'bg-pink-500' : 'bg-white/10'}`} />
        </View>
      </View>
    </View>
  );
}
