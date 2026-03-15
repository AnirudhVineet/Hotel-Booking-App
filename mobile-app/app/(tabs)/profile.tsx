import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

/**
 * ─── PROFILE SCREEN ─────────────────────────────────────────────────
 * Shows user info, settings menu, and logout button.
 * Matches the provided design with:
 *   - Header with "Profile" title
 *   - User avatar, name, and @handle
 *   - Settings list (Your Card, Security, Notification, Languages, Help)
 *   - Logout button
 */

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  // Derive a handle from the user's name (e.g. "John Doe" → "@John")
  const handle = user?.name ? `@${user.name.split(' ')[0]}` : '@Guest';

  const menuItems: MenuItem[] = [
    { icon: 'card-outline', label: 'Your Card', onPress: () => router.push('/your-card' as any) },
    { icon: 'shield-checkmark-outline', label: 'Security', onPress: () => router.push('/security' as any) },
    { icon: 'notifications-outline', label: 'Notification', onPress: () => router.push('/notifications' as any) },
    { icon: 'globe-outline', label: 'Languages', onPress: () => router.push('/language' as any) },
    { icon: 'help-circle-outline', label: 'Help and Support', onPress: () => router.push('/help-support' as any) },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* USER INFO */}
        <View style={styles.userSection}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            <Text style={styles.userHandle}>{handle}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => router.push('/personal-info' as any)}>
            <Ionicons name="create-outline" size={20} color="#666" />
          </Pressable>
        </View>

        {/* SETTINGS LABEL */}
        <Text style={styles.settingLabel}>Setting</Text>

        {/* MENU ITEMS */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: '#F5F5F5' },
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={22} color="#1A1A1A" style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </Pressable>
          ))}
        </View>

        {/* LOGOUT */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // User Info Section
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: '#999',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Setting Label
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    marginTop: 4,
  },

  // Menu Items
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  // Logout
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
