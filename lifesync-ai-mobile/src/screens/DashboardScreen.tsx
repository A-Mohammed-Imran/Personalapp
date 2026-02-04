import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useStatusEngine } from '../hooks/useStatusEngine';
import { useNotifications } from '../hooks/useNotifications';
import { useTaskTracking } from '../hooks/useTaskTracking';
import { sendTestNotification } from '../services/notifications';
import LiveClock from '../components/LiveClock';
import CurrentStatus from '../components/CurrentStatus';
import PlanSwitcher from '../components/PlanSwitcher';
import SwipeablePlanSwitcher from '../components/SwipeablePlanSwitcher';
import ActivityCard from '../components/ActivityCard';
import DailyProgress from '../components/DailyProgress';

export default function DashboardScreen() {
  const {
    displayMode,
    selectedPlan,
    scheduleConfig,
    timeRemaining,
    progress,
    currentTime,
    isMorningMode,
    sessionStartTime,
    sessionEndTime,
    setSelectedPlan,
  } = useStatusEngine();

  const {
    permissionGranted,
    isScheduled,
    requestPermissions,
  } = useNotifications();

  // Task tracking
  const totalTasks = scheduleConfig.activities.length;
  const {
    completedTasks,
    completionPercentage,
    linkedInStreak,
    streakAtRisk,
    timeUntilMidnight,
    toggleTask,
    isTaskCompleted,
  } = useTaskTracking(totalTasks);

  const handleNotificationPress = async () => {
    if (!permissionGranted) {
      Alert.alert(
        'Enable Notifications',
        'Allow notifications to receive alerts when Morning Mode ends at 6:30 AM',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: requestPermissions },
        ]
      );
    } else {
      Alert.alert(
        'Notifications Active',
        'You will receive a notification at 6:30 AM when Morning Mode ends.\n\nWould you like to send a test notification?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send Test', onPress: sendTestNotification },
        ]
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      {/* Status Bar Configuration */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 40 : 12,
            paddingHorizontal: 16,
            paddingBottom: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: '#6366f1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-white">LifeSync AI</Text>
              <Text className="text-white/80 text-sm mt-1">Your productivity companion</Text>
            </View>
            <View className="flex-row items-center">
              {/* Notification Bell */}
              <TouchableOpacity
                onPress={handleNotificationPress}
                className="mr-3 p-3 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <View className="relative">
                  <Feather
                    name="bell"
                    size={22}
                    color="#ffffff"
                  />
                  {permissionGranted && isScheduled && (
                    <View
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                      style={{ backgroundColor: '#10b981', borderColor: '#ffffff' }}
                    />
                  )}
                </View>
              </TouchableOpacity>
              {/* Mode Badge */}
              <View
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: isMorningMode
                    ? 'rgba(251, 191, 36, 0.3)'
                    : displayMode === 'planA'
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'rgba(236, 72, 153, 0.3)',
                }}
              >
                <Text className="font-bold text-sm text-white">
                  {isMorningMode ? '🌅 Morning' : displayMode === 'planA' ? '💼 Plan A' : '📚 Plan B'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="py-4">
            {/* Live Clock */}
            <LiveClock currentTime={currentTime} isMorningMode={isMorningMode} />

            {/* Current Status */}
            <CurrentStatus
              mode={displayMode}
              title={scheduleConfig.title}
              description={scheduleConfig.description}
              timeRemaining={timeRemaining}
            />

            {/* Swipeable Plan Switcher - Mobile Gesture */}
            <SwipeablePlanSwitcher
              currentPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
              disabled={isMorningMode}
            />

            {/* Button Plan Switcher - Fallback */}
            <PlanSwitcher
              currentPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
              disabled={isMorningMode}
            />

            {/* Focus Areas */}
            <View style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 20,
              marginHorizontal: 16,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View className="flex-row items-center mb-4">
                <View style={{
                  backgroundColor: '#6366f1',
                  padding: 8,
                  borderRadius: 10,
                  marginRight: 10,
                }}>
                  <Feather name="target" size={18} color="#ffffff" />
                </View>
                <Text className="text-gray-900 font-bold text-lg">Today's Focus</Text>
              </View>
              <View className="flex-row flex-wrap">
                {scheduleConfig.focus.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#eef2ff',
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 12,
                      marginRight: 8,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: '#c7d2fe',
                    }}
                  >
                    <Text style={{ color: '#6366f1', fontWeight: '600', fontSize: 13 }}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Daily Task Timer */}
            {completedTasks.length < totalTasks && (
              <View style={{
                marginHorizontal: 16,
                marginBottom: 16,
                borderRadius: 20,
                overflow: 'hidden',
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 16 }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View style={{
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        padding: 10,
                        borderRadius: 12,
                        marginRight: 12,
                      }}>
                        <Feather name="clock" size={20} color="#ffffff" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-base">
                          Complete Today's Tasks
                        </Text>
                        <Text className="text-white/80 text-sm mt-1">
                          {completedTasks.length}/{totalTasks} tasks done
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-white/70 text-xs">Time Left</Text>
                      <Text className="text-white font-bold text-lg">{timeUntilMidnight}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Activity Cards */}
            <View className="mx-4 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View style={{
                    backgroundColor: '#8b5cf6',
                    padding: 8,
                    borderRadius: 10,
                    marginRight: 10,
                  }}>
                    <Feather name="zap" size={18} color="#ffffff" />
                  </View>
                  <Text className="text-gray-900 font-bold text-xl">Action Cards</Text>
                </View>
                <View style={{
                  backgroundColor: completedTasks.length === totalTasks ? '#10b981' : '#f3f4f6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    color: completedTasks.length === totalTasks ? '#ffffff' : '#6b7280',
                    fontSize: 12,
                    fontWeight: '700'
                  }}>
                    {completedTasks.length}/{totalTasks} ✓
                  </Text>
                </View>
              </View>

              {scheduleConfig.activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isCompleted={isTaskCompleted(activity.id)}
                  onToggleComplete={toggleTask}
                  showStreak={activity.id === 'linkedin-zip'}
                  streakCount={linkedInStreak.currentStreak}
                  streakAtRisk={streakAtRisk}
                />
              ))}
            </View>

            {/* Daily Progress */}
            <DailyProgress
              progress={progress}
              timeRemaining={timeRemaining}
              sessionType={displayMode}
              startTime={sessionStartTime}
              endTime={sessionEndTime}
              completedTasks={completedTasks.length}
              totalTasks={totalTasks}
              taskCompletionPercentage={completionPercentage}
            />

            {/* LinkedIn Streak Warning Banner */}
            {streakAtRisk && linkedInStreak.currentStreak > 0 && (
              <View style={{
                marginHorizontal: 16,
                marginBottom: 16,
                borderRadius: 20,
                overflow: 'hidden',
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}>
                <LinearGradient
                  colors={['#ef4444', '#f97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 18 }}
                >
                  <View className="flex-row items-center">
                    <View style={{
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      padding: 12,
                      borderRadius: 14,
                      marginRight: 14,
                    }}>
                      <Feather name="alert-triangle" size={24} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg mb-1">
                        ⚠️ Streak at Risk!
                      </Text>
                      <Text className="text-white/90 text-sm">
                        Complete LinkedIn Zip to maintain your {linkedInStreak.currentStreak}-day streak!
                      </Text>
                      <Text className="text-white/80 text-xs mt-1">
                        ⏰ {timeUntilMidnight} remaining
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Notification Status Card */}
            <TouchableOpacity
              onPress={handleNotificationPress}
              activeOpacity={0.8}
              style={{
                backgroundColor: permissionGranted ? '#f0fdf4' : '#ffffff',
                borderRadius: 20,
                padding: 18,
                marginHorizontal: 16,
                marginBottom: 16,
                borderWidth: permissionGranted ? 2 : 1,
                borderColor: permissionGranted ? '#22c55e' : '#e5e7eb',
                shadowColor: permissionGranted ? '#22c55e' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: permissionGranted ? 0.2 : 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View style={{
                    backgroundColor: permissionGranted ? '#22c55e' : '#f3f4f6',
                    padding: 14,
                    borderRadius: 14,
                    marginRight: 14,
                  }}>
                    <Feather
                      name={permissionGranted ? 'bell' : 'bell-off'}
                      size={24}
                      color={permissionGranted ? '#ffffff' : '#9ca3af'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-base mb-1">
                      {permissionGranted ? '6:30 AM Alert Active' : 'Enable Notifications'}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {permissionGranted
                        ? 'You\'ll be notified when Morning Mode ends'
                        : 'Tap to enable morning alerts'}
                    </Text>
                  </View>
                </View>
                <Feather
                  name="chevron-right"
                  size={22}
                  color={permissionGranted ? '#22c55e' : '#9ca3af'}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
