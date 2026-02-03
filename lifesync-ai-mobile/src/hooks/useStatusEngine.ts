import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ModeType,
  getCurrentMode,
  getScheduleByMode,
  getTimeRemaining,
  getMorningProgress,
  getWorkProgress,
  formatCurrentTime,
  ScheduleConfig,
} from '../config/schedule';

const PLAN_STORAGE_KEY = '@lifesync_selected_plan';

interface StatusEngineState {
  currentMode: ModeType;
  displayMode: ModeType;
  selectedPlan: 'planA' | 'planB';
  scheduleConfig: ScheduleConfig;
  timeRemaining: string;
  progress: number;
  currentTime: string;
  isMorningMode: boolean;
  sessionStartTime: string;
  sessionEndTime: string;
}

interface StatusEngineActions {
  setSelectedPlan: (plan: 'planA' | 'planB') => void;
}

export function useStatusEngine(): StatusEngineState & StatusEngineActions {
  const [currentMode, setCurrentMode] = useState<ModeType>('planA');
  const [selectedPlan, setSelectedPlanState] = useState<'planA' | 'planB'>('planA');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [sessionStartTime, setSessionStartTime] = useState<string>('12:00 AM');
  const [sessionEndTime, setSessionEndTime] = useState<string>('6:30 AM');

  // Load saved plan from AsyncStorage
  useEffect(() => {
    const loadSavedPlan = async () => {
      try {
        const savedPlan = await AsyncStorage.getItem(PLAN_STORAGE_KEY);
        if (savedPlan === 'planA' || savedPlan === 'planB') {
          setSelectedPlanState(savedPlan);
        }
      } catch (error) {
        console.log('Error loading saved plan:', error);
      }
    };
    loadSavedPlan();
  }, []);

  // Save plan to AsyncStorage when changed
  const setSelectedPlan = useCallback(async (plan: 'planA' | 'planB') => {
    setSelectedPlanState(plan);
    try {
      await AsyncStorage.setItem(PLAN_STORAGE_KEY, plan);
    } catch (error) {
      console.log('Error saving plan:', error);
    }
  }, []);

  // Update status
  useEffect(() => {
    const updateStatus = () => {
      const newMode = getCurrentMode();
      setCurrentMode(newMode);
      setTimeRemaining(getTimeRemaining());
      setCurrentTime(formatCurrentTime());

      if (newMode === 'morning') {
        setProgress(getMorningProgress());
        setSessionStartTime('12:00 AM');
        setSessionEndTime('6:30 AM');
      } else {
        setProgress(getWorkProgress());
        setSessionStartTime('6:30 AM');
        setSessionEndTime('10:00 PM');
      }
    };

    // Initial update
    updateStatus();

    // Update every second for clock
    const clockInterval = setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 1000);

    // Update mode and progress every minute
    const statusInterval = setInterval(updateStatus, 60000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(statusInterval);
    };
  }, []);

  // Determine display mode (morning mode takes priority)
  const displayMode = currentMode === 'morning' ? 'morning' : selectedPlan;
  const scheduleConfig = getScheduleByMode(displayMode);
  const isMorningMode = currentMode === 'morning';

  return {
    currentMode,
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
  };
}
