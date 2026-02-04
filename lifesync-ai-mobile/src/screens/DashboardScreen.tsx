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
import ActivityCard from '../components/ActivityCard';
import DailyProgress from '../components/DailyProgress';
import PremiumPlanSelector from '../components/PremiumPlanSelector';

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
    <View style={{ flex: 1, backgroundColor: '#050505' }}>
      {/* Background Deep Gradient */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <LinearGradient
          colors={['#0c0c1e', '#050505']}
          style={{ flex: 1 }}
        />
        {/* Subtle spot light */}
        <View style={{ position: 'absolute', top: -50, left: '50%', transform: [{ translateX: -150 }], width: 300, height: 300, borderRadius: 150, backgroundColor: '#4f46e510', opacity: 0.5 }} />
      </View>

      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <SafeAreaView className="flex-1">
        {/* Modern Header */}
        <View
          style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10 }}
          className="px-6 pb-4 flex-row items-center justify-between"
        >
          <View>
            <View className="flex-row items-center mb-1">
              <View className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
              <Text className="text-white text-[10px] font-black tracking-[0.2em] uppercase opacity-40">System Active</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-3xl font-black text-white tracking-tight">Dashboard</Text>
              <View className="ml-3 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </View>
            </View>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleNotificationPress}
              activeOpacity={0.7}
              className="w-11 h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 mr-3"
            >
              <Feather name="bell" size={20} color="#ffffff" />
              {permissionGranted && isScheduled && (
                <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500 border border-[#050505]" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5"
            >
              <Text className="text-white text-[10px] font-black tracking-widest uppercase">
                {isMorningMode ? 'Morning' : selectedPlan === 'planA' ? 'Plan A' : 'Plan B'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="py-2 px-6">
            {/* Elegant Live Clock */}
            <View className="mb-8">
              <LiveClock currentTime={currentTime} isMorningMode={isMorningMode} />
            </View>

            {/* Glass Status Card */}
            <View className="mb-8">
              <CurrentStatus
                mode={displayMode}
                title={scheduleConfig.title}
                description={scheduleConfig.description}
                timeRemaining={timeRemaining}
              />
            </View>

            {/* Segmented Control for Plans */}
            <View className="mb-12">
              <View className="flex-row items-center mb-6 px-1">
                <View className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3 shadow-[0_0_8px_#6366f1]" />
                <Text className="text-white text-lg font-black tracking-tight uppercase opacity-50">Select Execution Plan</Text>
              </View>
              <PremiumPlanSelector
                currentPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
                disabled={isMorningMode}
              />
            </View>

            {/* Action Cards Section */}
            <View className="mb-10">
              <View className="flex-row items-center justify-between mb-8">
                <View>
                  <Text className="text-white text-2xl font-black mb-1">Core Activities</Text>
                  <View className="flex-row items-center">
                    <View className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mr-2">
                      <Text className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">{completedTasks.length} / {totalTasks} Completed</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10"
                >
                  <Text className="text-white/60 text-[10px] font-black uppercase tracking-widest mr-2">Schedule</Text>
                  <Feather name="calendar" size={14} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
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

            {/* Progress Visualization */}
            <View className="mb-10">
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
            </View>

            {/* Streak Risk Alert (Premium Styled) */}
            {streakAtRisk && linkedInStreak.currentStreak > 0 && (
              <TouchableOpacity activeOpacity={0.9} className="mb-6">
                <LinearGradient
                  colors={['#ef4444', '#b91c1c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 20, borderRadius: 24 }}
                >
                  <View className="flex-row items-center">
                    <View className="bg-white/20 p-3 rounded-2xl mr-4">
                      <Feather name="alert-triangle" size={24} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-black text-lg">Streak Critical</Text>
                      <Text className="text-white/80 text-sm">Finish LinkedIn Zip to save your {linkedInStreak.currentStreak}d streak.</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Integration Support Link */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="mb-12 p-6 rounded-[32px] border border-white/10 bg-white/5 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="bg-indigo-500/20 w-14 h-14 items-center justify-center rounded-2xl mr-4 border border-indigo-500/20">
                  <Feather name="bar-chart-2" size={24} color="#818cf8" />
                </View>
                <View>
                  <Text className="text-white font-black text-lg">Performance Insights</Text>
                  <Text className="text-white/30 text-xs mt-0.5">View your productivity analytics</Text>
                </View>
              </View>
              <View className="w-10 h-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <Feather name="arrow-right" size={20} color="rgba(255,255,255,0.4)" />
              </View>
            </TouchableOpacity>

            {/* Footer Branding */}
            <View className="items-center py-6 mb-10">
              <View className="flex-row items-center opacity-20 mb-2">
                <View className="h-[1px] w-8 bg-white mr-4" />
                <Feather name="zap" size={14} color="#ffffff" />
                <View className="h-[1px] w-8 bg-white ml-4" />
              </View>
              <Text className="text-white/20 text-[10px] font-black tracking-[0.3em] uppercase">Powered by LifeSync OS</Text>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

