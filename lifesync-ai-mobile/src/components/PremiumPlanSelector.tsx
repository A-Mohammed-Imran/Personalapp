import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface PremiumPlanSelectorProps {
    currentPlan: 'planA' | 'planB';
    onPlanChange: (plan: 'planA' | 'planB') => void;
    disabled?: boolean;
}

export default function PremiumPlanSelector({
    currentPlan,
    onPlanChange,
    disabled,
}: PremiumPlanSelectorProps) {
    const [containerWidth, setContainerWidth] = useState(0);
    const slideAnim = useRef(new Animated.Value(currentPlan === 'planA' ? 0 : 1)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: currentPlan === 'planA' ? 0 : 1,
            useNativeDriver: false,
            tension: 80,
            friction: 12,
        }).start();
    }, [currentPlan]);

    const handlePlanSelect = (plan: 'planA' | 'planB') => {
        if (disabled || plan === currentPlan) return;
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPlanChange(plan);
    };

    const alphaOpacity = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
    });

    const betaOpacity = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
    });

    const alphaScale = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.95],
    });

    const betaScale = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
    });

    return (
        <View className="px-1">
            {/* Premium Toggle Container */}
            <View
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                className="bg-white/5 rounded-[32px] border border-white/10 flex-row relative height-[72px] overflow-hidden"
                style={{ height: 72 }}
            >
                {/* Animated Background Slider */}
                {containerWidth > 0 && (
                    <Animated.View
                        style={{
                            position: 'absolute',
                            left: 4,
                            top: 4,
                            bottom: 4,
                            width: (containerWidth / 2) - 4,
                            borderRadius: 28,
                            transform: [{
                                translateX: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, (containerWidth / 2) - 4]
                                })
                            }],
                            zIndex: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <LinearGradient
                            colors={currentPlan === 'planA' ? ['#6366f1', '#4f46e5'] : ['#ec4899', '#db2777']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        {/* Glossy overlay */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>
                )}

                {/* Plan Alpha Button */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handlePlanSelect('planA')}
                    className="flex-1 items-center justify-center z-10"
                >
                    <Animated.View
                        style={{ opacity: alphaOpacity, transform: [{ scale: alphaScale }] }}
                        className="flex-row items-center"
                    >
                        <View className={`w-8 h-8 rounded-xl items-center justify-center mr-3 ${currentPlan === 'planA' ? 'bg-white/20' : 'bg-transparent'}`}>
                            <Feather name="zap" size={18} color={currentPlan === 'planA' ? '#fff' : '#ffffff40'} />
                        </View>
                        <Text className={`font-black tracking-[0.1em] text-[13px] uppercase ${currentPlan === 'planA' ? 'text-white' : 'text-white/40'}`}>
                            Alpha
                        </Text>
                    </Animated.View>
                </TouchableOpacity>

                {/* Plan Beta Button */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handlePlanSelect('planB')}
                    className="flex-1 items-center justify-center z-10"
                >
                    <Animated.View
                        style={{ opacity: betaOpacity, transform: [{ scale: betaScale }] }}
                        className="flex-row items-center"
                    >
                        <View className={`w-8 h-8 rounded-xl items-center justify-center mr-3 ${currentPlan === 'planB' ? 'bg-white/20' : 'bg-transparent'}`}>
                            <Feather name="layers" size={18} color={currentPlan === 'planB' ? '#fff' : '#ffffff40'} />
                        </View>
                        <Text className={`font-black tracking-[0.1em] text-[13px] uppercase ${currentPlan === 'planB' ? 'text-white' : 'text-white/40'}`}>
                            Beta
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>

            {/* Visual Reinforcement (Higher Impact Design) */}
            <View className="mt-8">
                <View className="flex-row justify-between">
                    <Animated.View
                        style={{
                            opacity: alphaOpacity,
                            transform: [{ scale: alphaScale }],
                            flex: 1,
                            marginRight: 10
                        }}
                    >
                        <LinearGradient
                            colors={currentPlan === 'planA' ? ['rgba(99, 102, 241, 0.15)', 'rgba(79, 70, 229, 0.05)'] : ['transparent', 'transparent']}
                            className={`p-5 rounded-[32px] border ${currentPlan === 'planA' ? 'border-indigo-500/30' : 'border-white/5 bg-white/2'}`}
                        >
                            <View className="flex-row items-center mb-4">
                                <View className={`w-2 h-2 rounded-full mr-2 ${currentPlan === 'planA' ? 'bg-indigo-400' : 'bg-white/10'}`} />
                                <Text className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentPlan === 'planA' ? 'text-indigo-400' : 'text-white/20'}`}>Alpha Mode</Text>
                            </View>
                            <Text className={`text-[15px] font-black tracking-tight mb-1 ${currentPlan === 'planA' ? 'text-white' : 'text-white/20'}`}>Engineering</Text>
                            <Text className={`text-[11px] font-bold ${currentPlan === 'planA' ? 'text-white/40' : 'text-white/5'}`}>LeetCode & Core Dev</Text>
                        </LinearGradient>
                    </Animated.View>

                    <Animated.View
                        style={{
                            opacity: betaOpacity,
                            transform: [{ scale: betaScale }],
                            flex: 1,
                            marginLeft: 10
                        }}
                    >
                        <LinearGradient
                            colors={currentPlan === 'planB' ? ['rgba(236, 72, 153, 0.15)', 'rgba(219, 39, 119, 0.05)'] : ['transparent', 'transparent']}
                            className={`p-5 rounded-[32px] border ${currentPlan === 'planB' ? 'border-pink-500/30' : 'border-white/5 bg-white/2'}`}
                        >
                            <View className="flex-row items-center mb-4">
                                <View className={`w-2 h-2 rounded-full mr-2 ${currentPlan === 'planB' ? 'bg-pink-400' : 'bg-white/10'}`} />
                                <Text className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentPlan === 'planB' ? 'text-pink-400' : 'text-white/20'}`}>Beta Mode</Text>
                            </View>
                            <Text className={`text-[15px] font-black tracking-tight mb-1 ${currentPlan === 'planB' ? 'text-white' : 'text-white/20'}`}>Accelerated</Text>
                            <Text className={`text-[11px] font-bold ${currentPlan === 'planB' ? 'text-white/40' : 'text-white/5'}`}>Job Search & Courses</Text>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </View>

            {disabled && (
                <View className="mt-8 bg-black/40 border border-white/5 py-5 rounded-[32px] flex-row items-center justify-center">
                    <View className="bg-amber-500/10 p-2 rounded-xl mr-4">
                        <Feather name="shield" size={16} color="#f59e0b" />
                    </View>
                    <View>
                        <Text className="text-white/60 text-[11px] font-black uppercase tracking-[0.2em]">Manual Controls Locked</Text>
                        <Text className="text-white/20 text-[10px] font-bold mt-0.5">Automated morning routine active</Text>
                    </View>
                </View>
            )}
        </View>
    );
}
