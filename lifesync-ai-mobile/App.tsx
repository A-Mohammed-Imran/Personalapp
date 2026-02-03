import './global.css';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DashboardScreen />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
