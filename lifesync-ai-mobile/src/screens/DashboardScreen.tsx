import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useStatusEngine } from '../hooks/useStatusEngine';
import { useNotifications } from '../hooks/useNotifications';
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f0f4ff' }}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
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
                backgroundColor: '#f3f4f6',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}>
                <Text className="text-gray-600 text-xs font-semibold">
                  {scheduleConfig.activities.filter(a => a.url).length} links
                </Text>
              </View>
            </View>

            {scheduleConfig.activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>

          {/* Daily Progress */}
          <DailyProgress
            progress={progress}
            timeRemaining={timeRemaining}
            sessionType={displayMode}
            startTime={sessionStartTime}
            endTime={sessionEndTime}
          />

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
  );
}
