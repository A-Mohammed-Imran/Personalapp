// LifeSync AI Mobile - Schedule Configuration
// Copied from Web project with mobile-specific adaptations

export type ModeType = 'morning' | 'planA' | 'planB';

export interface ScheduleConfig {
  mode: ModeType;
  title: string;
  description: string;
  endTime?: string; // Time when this mode ends (HH:MM format)
  focus: string[];
  activities: Activity[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  url?: string;
  appScheme?: string; // Deep link scheme for opening native apps
  icon: string;
  color: string;
  // Mobile-specific: background colors for React Native
  bgColor: string;
  textColor: string;
  useAppIcon?: boolean; // Flag to use actual app logo instead of Feather icon
  appIconUrl?: string | number; // URL for app logo image or local require()
}

// Morning Mode Configuration (Active until 6:30 AM)
export const MORNING_MODE: ScheduleConfig = {
  mode: 'morning',
  title: 'Morning Mode',
  description: 'Focus on English Language Learning',
  endTime: '06:30',
  focus: ['English Language', 'LinkedIn Engagement', 'PeerUp Practice'],
  activities: [
    {
      id: 'peerup-english',
      title: 'English Learning - PeerUp',
      description: 'Practice English conversation with PeerUp',
      appScheme: 'peerup://', // Deep link to open PeerUp app
      url: 'https://play.google.com/store/apps/details?id=com.peerup', // Fallback if app not installed
      icon: 'message-circle',
      color: 'bg-indigo-600',
      bgColor: '#4f46e5',
      textColor: '#ffffff',
      useAppIcon: true,
      appIconUrl: require('../../assets/peerup-logo.png'), // Local PeerUp logo
    },
    {
      id: 'english-reading',
      title: 'English Reading',
      description: 'Read articles, books, or news in English',
      icon: 'book-open',
      color: 'bg-blue-500',
      bgColor: '#3b82f6',
      textColor: '#ffffff',
    },
    {
      id: 'english-vocabulary',
      title: 'Vocabulary Building',
      description: 'Learn new words and phrases',
      icon: 'brain',
      color: 'bg-purple-500',
      bgColor: '#a855f7',
      textColor: '#ffffff',
    },
    {
      id: 'linkedin-zip',
      title: 'LinkedIn Zip Game',
      description: 'Complete the daily LinkedIn Zip game',
      url: 'https://www.linkedin.com/games/zip/',
      appScheme: 'linkedin://', // Deep link to LinkedIn app
      icon: 'linkedin',
      color: 'bg-blue-600',
      bgColor: '#0a66c2',
      textColor: '#ffffff',
      useAppIcon: true,
      appIconUrl: require('../../assets/linkedin-logo.png'), // Local LinkedIn logo
    },
  ],
};

// Plan A Configuration
export const PLAN_A: ScheduleConfig = {
  mode: 'planA',
  title: 'Plan A - Professional Development',
  description: 'Focus on coding skills and team collaboration',
  focus: ['LeetCode Problem Solving', 'Team Collaboration'],
  activities: [
    {
      id: 'leetcode',
      title: 'LeetCode',
      description: 'Solve algorithmic problems and improve DSA skills',
      url: 'https://leetcode.com/problemset/',
      icon: 'code',
      color: 'bg-orange-500',
      bgColor: '#f97316',
      textColor: '#ffffff',
    },
    {
      id: 'leetcode-contest',
      title: 'LeetCode Contests',
      description: 'Participate in weekly coding contests',
      url: 'https://leetcode.com/contest/',
      icon: 'trophy',
      color: 'bg-yellow-500',
      bgColor: '#eab308',
      textColor: '#ffffff',
    },
    {
      id: 'team-collab',
      title: 'Team Collaboration',
      description: 'Work on team projects and communication',
      url: 'https://github.com',
      icon: 'users',
      color: 'bg-teal-500',
      bgColor: '#14b8a6',
      textColor: '#ffffff',
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Study system architecture patterns',
      url: 'https://github.com/donnemartin/system-design-primer',
      icon: 'git-branch',
      color: 'bg-indigo-500',
      bgColor: '#6366f1',
      textColor: '#ffffff',
    },
  ],
};

// Plan B Configuration
export const PLAN_B: ScheduleConfig = {
  mode: 'planB',
  title: 'Plan B - Learning & Internship',
  description: 'Focus on courses and internship work',
  focus: ['4m Internship', 'Coursera', 'Udemy'],
  activities: [
    {
      id: 'internship',
      title: '4m Internship',
      description: 'Complete internship tasks and projects',
      icon: 'briefcase',
      color: 'bg-red-500',
      bgColor: '#ef4444',
      textColor: '#ffffff',
    },
    {
      id: 'coursera',
      title: 'Coursera Courses',
      description: 'Continue online learning on Coursera',
      url: 'https://www.coursera.org/learn',
      icon: 'graduation-cap',
      color: 'bg-blue-600',
      bgColor: '#2563eb',
      textColor: '#ffffff',
    },
    {
      id: 'coursera-certificates',
      title: 'Coursera Certificates',
      description: 'Track your certificate progress',
      url: 'https://www.coursera.org/accomplishments',
      icon: 'award',
      color: 'bg-green-600',
      bgColor: '#16a34a',
      textColor: '#ffffff',
    },
    {
      id: 'udemy',
      title: 'Udemy Courses',
      description: 'Complete Udemy courses and tutorials',
      url: 'https://www.udemy.com/home/my-courses/',
      icon: 'play-circle',
      color: 'bg-purple-600',
      bgColor: '#9333ea',
      textColor: '#ffffff',
    },
  ],
};

// Helper function to determine current mode based on time
export function getCurrentMode(): ModeType {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Morning mode is active before 6:30 AM (390 minutes)
  const morningEndTime = 6 * 60 + 30; // 6:30 AM in minutes

  if (currentTimeInMinutes < morningEndTime) {
    return 'morning';
  }

  // After 6:30 AM, default to Plan A (user can toggle)
  return 'planA';
}

// Helper function to get schedule config by mode
export function getScheduleByMode(mode: ModeType): ScheduleConfig {
  switch (mode) {
    case 'morning':
      return MORNING_MODE;
    case 'planA':
      return PLAN_A;
    case 'planB':
      return PLAN_B;
    default:
      return PLAN_A;
  }
}

// Helper function to calculate time remaining in current session
export function getTimeRemaining(): string {
  const now = new Date();
  const currentMode = getCurrentMode();

  if (currentMode === 'morning') {
    const morningEnd = new Date();
    morningEnd.setHours(6, 30, 0, 0);

    // If we're past 6:30, it means morning mode is over
    if (now > morningEnd) {
      return 'Session ended';
    }

    const diff = morningEnd.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  }

  return 'No time limit';
}

// Helper function to calculate progress percentage for morning mode
export function getMorningProgress(): number {
  const now = new Date();
  const currentMode = getCurrentMode();

  if (currentMode !== 'morning') {
    return 100; // Morning is over
  }

  // Assuming morning starts at midnight (0:00)
  const morningStartMinutes = 0;
  const morningEndMinutes = 6 * 60 + 30; // 6:30 AM

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const totalDuration = morningEndMinutes - morningStartMinutes;
  const elapsed = currentTimeInMinutes - morningStartMinutes;

  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

// Mobile-specific: Get progress for Plan A/B (work hours 6:30 AM - 10:00 PM)
export function getWorkProgress(): number {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const workStartMinutes = 6 * 60 + 30; // 6:30 AM
  const workEndMinutes = 22 * 60; // 10:00 PM

  if (currentTimeInMinutes < workStartMinutes) {
    return 0;
  }

  if (currentTimeInMinutes >= workEndMinutes) {
    return 100;
  }

  const totalWorkMinutes = workEndMinutes - workStartMinutes;
  const elapsedMinutes = currentTimeInMinutes - workStartMinutes;

  return Math.min(100, Math.max(0, (elapsedMinutes / totalWorkMinutes) * 100));
}

// Mobile-specific: Format current time
export function formatCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Mobile-specific: Check if it's night time (for UI theming)
export function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 20;
}
