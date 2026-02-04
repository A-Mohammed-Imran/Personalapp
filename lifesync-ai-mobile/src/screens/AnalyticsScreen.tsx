import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import {
    getProductivityInsights,
    getUserAchievements,
    getUserGoals,
    getDailyAnalytics,
    getAnalyticsRange,
    type Achievement,
    type UserGoal,
} from '../services/analyticsService';
import { getMoodStatistics } from '../services/notificationsService';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const [insights, setInsights] = useState<any>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [goals, setGoals] = useState<UserGoal[]>([]);
    const [moodStats, setMoodStats] = useState<any>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(30);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [selectedPeriod]);

    async function loadAnalytics() {
        setLoading(true);
        try {
            const [insightsData, achievementsData, goalsData, moodData] = await Promise.all([
                getProductivityInsights(selectedPeriod),
                getUserAchievements(),
                getUserGoals(false),
                getMoodStatistics(selectedPeriod),
            ]);

            setInsights(insightsData);
            setAchievements(achievementsData);
            setGoals(goalsData);
            setMoodStats(moodData);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    }

    const getMoodEmoji = (mood: string) => {
        const moodMap: Record<string, string> = {
            excellent: '😄',
            good: '🙂',
            neutral: '😐',
            bad: '😕',
            terrible: '😢',
        };
        return moodMap[mood] || '😐';
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header */}
            <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: 60,
                    paddingHorizontal: 20,
                    paddingBottom: 30,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                }}
            >
                <Text className="text-3xl font-bold text-white mb-2">Analytics</Text>
                <Text className="text-white/80 text-base">Track your progress & insights</Text>

                {/* Period Selector */}
                <View className="flex-row mt-6 bg-white/20 rounded-2xl p-1">
                    {[7, 30, 90].map((period) => (
                        <TouchableOpacity
                            key={period}
                            onPress={() => setSelectedPeriod(period as 7 | 30 | 90)}
                            className="flex-1"
                            style={{
                                backgroundColor: selectedPeriod === period ? '#ffffff' : 'transparent',
                                paddingVertical: 10,
                                borderRadius: 14,
                            }}
                        >
                            <Text
                                className="text-center font-bold"
                                style={{
                                    color: selectedPeriod === period ? '#6366f1' : '#ffffff',
                                }}
                            >
                                {period}d
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </LinearGradient>

            <View className="p-5">
                {/* Productivity Overview */}
                {insights && (
                    <View className="bg-white rounded-3xl p-6 mb-5 shadow-sm">
                        <View className="flex-row items-center mb-5">
                            <View className="bg-indigo-100 p-3 rounded-xl mr-3">
                                <Feather name="trending-up" size={24} color="#6366f1" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900">Productivity Overview</Text>
                        </View>

                        <View className="flex-row flex-wrap">
                            {/* Total Completions */}
                            <View className="w-1/2 mb-4">
                                <Text className="text-gray-500 text-sm mb-1">Total Tasks</Text>
                                <Text className="text-3xl font-bold text-indigo-600">
                                    {insights.totalCompletions}
                                </Text>
                            </View>

                            {/* Average Rate */}
                            <View className="w-1/2 mb-4">
                                <Text className="text-gray-500 text-sm mb-1">Avg. Rate</Text>
                                <Text className="text-3xl font-bold text-green-600">
                                    {insights.averageCompletionRate}%
                                </Text>
                            </View>

                            {/* Active Days */}
                            <View className="w-1/2 mb-4">
                                <Text className="text-gray-500 text-sm mb-1">Active Days</Text>
                                <Text className="text-3xl font-bold text-purple-600">
                                    {insights.totalDays}
                                </Text>
                            </View>

                            {/* Best Streak */}
                            <View className="w-1/2 mb-4">
                                <Text className="text-gray-500 text-sm mb-1">Best Streak</Text>
                                <Text className="text-3xl font-bold text-orange-600">
                                    {insights.bestStreak} 🔥
                                </Text>
                            </View>
                        </View>

                        {/* Most Productive Day */}
                        {insights.mostProductiveDay && (
                            <View className="mt-4 p-4 bg-indigo-50 rounded-2xl">
                                <Text className="text-gray-700 font-semibold mb-1">
                                    🏆 Most Productive Day
                                </Text>
                                <Text className="text-gray-600 text-sm">
                                    {new Date(insights.mostProductiveDay).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    - {insights.mostProductiveDayRate}% completion
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Mood Statistics */}
                {moodStats && moodStats.totalEntries > 0 && (
                    <View className="bg-white rounded-3xl p-6 mb-5 shadow-sm">
                        <View className="flex-row items-center mb-5">
                            <View className="bg-pink-100 p-3 rounded-xl mr-3">
                                <Feather name="heart" size={24} color="#ec4899" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900">Mood Tracker</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-500 text-sm mb-2">Average Energy Level</Text>
                            <View className="flex-row items-center">
                                <View className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <View
                                        className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
                                        style={{ width: `${(moodStats.averageEnergy / 5) * 100}%` }}
                                    />
                                </View>
                                <Text className="ml-3 text-lg font-bold text-pink-600">
                                    {moodStats.averageEnergy}/5
                                </Text>
                            </View>
                        </View>

                        {/* Mood Distribution */}
                        <View>
                            <Text className="text-gray-500 text-sm mb-3">Mood Distribution</Text>
                            {Object.entries(moodStats.moodDistribution).map(([mood, count]: [string, any]) => (
                                <View key={mood} className="flex-row items-center mb-2">
                                    <Text className="text-2xl mr-2">{getMoodEmoji(mood)}</Text>
                                    <View className="flex-1">
                                        <View className="flex-row justify-between mb-1">
                                            <Text className="text-gray-700 capitalize">{mood}</Text>
                                            <Text className="text-gray-500 text-sm">{count} days</Text>
                                        </View>
                                        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <View
                                                className="h-full bg-pink-500 rounded-full"
                                                style={{ width: `${(count / moodStats.totalEntries) * 100}%` }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Active Goals */}
                {goals.length > 0 && (
                    <View className="bg-white rounded-3xl p-6 mb-5 shadow-sm">
                        <View className="flex-row items-center mb-5">
                            <View className="bg-green-100 p-3 rounded-xl mr-3">
                                <Feather name="target" size={24} color="#10b981" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900">Active Goals</Text>
                        </View>

                        {goals.map((goal) => (
                            <View key={goal.id} className="mb-4 last:mb-0">
                                <View className="flex-row justify-between items-start mb-2">
                                    <Text className="text-gray-900 font-semibold flex-1">{goal.title}</Text>
                                    <Text className="text-gray-500 text-sm">
                                        {goal.current_value}/{goal.target_value}
                                    </Text>
                                </View>
                                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <LinearGradient
                                        colors={['#10b981', '#059669']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            height: '100%',
                                            width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%`,
                                            borderRadius: 9999,
                                        }}
                                    />
                                </View>
                                {goal.description && (
                                    <Text className="text-gray-500 text-sm mt-2">{goal.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Achievements */}
                {achievements.length > 0 && (
                    <View className="bg-white rounded-3xl p-6 mb-5 shadow-sm">
                        <View className="flex-row items-center mb-5">
                            <View className="bg-yellow-100 p-3 rounded-xl mr-3">
                                <Feather name="award" size={24} color="#f59e0b" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900">Achievements</Text>
                        </View>

                        <View className="flex-row flex-wrap -mx-2">
                            {achievements.map((achievement) => (
                                <View key={achievement.id} className="w-1/2 px-2 mb-4">
                                    <View className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200">
                                        <Text className="text-4xl mb-2 text-center">{achievement.icon}</Text>
                                        <Text className="text-gray-900 font-bold text-sm text-center mb-1">
                                            {achievement.title}
                                        </Text>
                                        <Text className="text-gray-600 text-xs text-center">
                                            {achievement.description}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Empty State */}
                {!loading &&
                    (!insights || insights.totalCompletions === 0) &&
                    achievements.length === 0 && (
                        <View className="bg-white rounded-3xl p-10 items-center">
                            <Text className="text-6xl mb-4">📊</Text>
                            <Text className="text-gray-900 font-bold text-xl mb-2">No Data Yet</Text>
                            <Text className="text-gray-500 text-center">
                                Complete tasks to start tracking your progress and earning achievements!
                            </Text>
                        </View>
                    )}
            </View>
        </ScrollView>
    );
}
