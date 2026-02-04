import './global.css';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import DashboardScreen from './src/screens/DashboardScreen';
import { useAuth } from './src/hooks/useAuth';
import { isSupabaseConfigured } from './src/config/supabase';

export default function App() {
  const { isAuthenticated, isLoading, error } = useAuth();

  // Check if MySQL API is configured (Assuming it's always configured for now)
  const isApiConfigured = true;

  if (!isApiConfigured) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#0a0a0a' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        >
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={{
              backgroundColor: '#fbbf24',
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}>
              <Feather name="alert-triangle" size={40} color="#0a0a0a" />
            </View>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
              MySQL API Not Connected
            </Text>
            <Text style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
              Please set up your MySQL backend to continue
            </Text>
          </View>

          <View style={{ backgroundColor: '#1f2937', borderRadius: 20, padding: 20, marginBottom: 20 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
              📋 Setup Instructions
            </Text>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  backgroundColor: '#3b82f6',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 22 }}>
                    Go to <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>supabase.com</Text> and sign in
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  backgroundColor: '#3b82f6',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 22 }}>
                    Create a new project: <Text style={{ color: '#10b981', fontWeight: 'bold' }}>"lifesync-ai-mobile"</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  backgroundColor: '#3b82f6',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>3</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 22 }}>
                    Go to <Text style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Settings → API</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  backgroundColor: '#3b82f6',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>4</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 22 }}>
                    Copy <Text style={{ color: '#f59e0b', fontWeight: 'bold' }}>Project URL</Text> and <Text style={{ color: '#f59e0b', fontWeight: 'bold' }}>anon key</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  backgroundColor: '#3b82f6',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>5</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 22 }}>
                    Edit <Text style={{ color: '#ec4899', fontWeight: 'bold' }}>.env</Text> file in project root
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  backgroundColor: '#3b82f6',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>6</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e5e7eb', fontSize: 15, lineHeight: 22 }}>
                    Restart Expo: Press <Text style={{ color: '#10b981', fontWeight: 'bold' }}>'r'</Text> in terminal
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://supabase.com')}
            style={{
              backgroundColor: '#10b981',
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}
          >
            <Feather name="external-link" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Open Supabase Dashboard
            </Text>
          </TouchableOpacity>

          <View style={{ backgroundColor: '#1f2937', borderRadius: 16, padding: 16 }}>
            <Text style={{ color: '#9ca3af', fontSize: 13, lineHeight: 20 }}>
              💡 <Text style={{ fontWeight: 'bold' }}>Tip:</Text> The .env file is located at:{'\n'}
              <Text style={{ color: '#6366f1', fontFamily: 'monospace' }}>
                lifesync-ai-mobile/.env
              </Text>
            </Text>
          </View>
        </ScrollView>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    );
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          backgroundColor: '#0a0a0a',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>
            Initializing LifeSync AI...
          </Text>
        </View>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    );
  }

  // Show error screen if authentication failed
  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          backgroundColor: '#0a0a0a',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            Authentication Error
          </Text>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {error.message}
          </Text>
          <Text style={{ color: '#9ca3af', marginTop: 16, textAlign: 'center' }}>
            Please check your Supabase configuration in .env file
          </Text>
        </View>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    );
  }

  // Show main app when authenticated
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DashboardScreen />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
