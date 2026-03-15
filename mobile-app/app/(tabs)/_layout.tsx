import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated as RNAnimated } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/utils/api';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null); // null = checking
  const [dismissed, setDismissed] = useState(false);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;

  const checkBackend = async () => {
    setDismissed(false);
    const ok = await api.checkHealth();
    setBackendOnline(ok);
  };

  useEffect(() => {
    checkBackend();
    // Re-check every 30 seconds
    const interval = setInterval(async () => {
      const ok = await api.checkHealth();
      setBackendOnline(ok);
      if (ok) setDismissed(false); // reset dismiss when it comes back
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animate banner in/out
  useEffect(() => {
    const shouldShow = backendOnline !== null && !backendOnline && !dismissed;
    RNAnimated.timing(fadeAnim, {
      toValue: shouldShow ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [backendOnline, dismissed]);

  const showBanner = backendOnline !== null && !backendOnline && !dismissed;

  return (
    <View style={{ flex: 1 }}>
      {/* Backend Offline Banner */}
      {showBanner && (
        <RNAnimated.View style={[styles.banner, { opacity: fadeAnim, paddingTop: insets.top + 4 }]}>          
          <Ionicons name="cloud-offline-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.bannerText}>Backend server is offline</Text>
          <View style={styles.bannerActions}>
            <Pressable onPress={checkBackend} hitSlop={10} style={styles.retryBtn}>
              <Ionicons name="refresh" size={16} color="#FFF" />
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
            <Pressable onPress={() => setDismissed(true)} hitSlop={10} style={{ marginLeft: 12 }}>
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.7)" />
            </Pressable>
          </View>
        </RNAnimated.View>
      )}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2558B5',
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="booking"
          options={{
            title: 'My Booking',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "document-text" : "document-text-outline"} size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="message"
          options={{
            title: 'Message',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 100,
  },
  bannerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});