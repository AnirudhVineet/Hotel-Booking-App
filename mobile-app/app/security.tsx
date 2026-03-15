import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SecurityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [faceId, setFaceId] = useState(true);
  const [rememberPassword, setRememberPassword] = useState(true);
  const [touchId, setTouchId] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Face ID</Text>
          <Switch value={faceId} onValueChange={setFaceId} trackColor={{ false: '#E0E0E0', true: '#2558B5' }} thumbColor="#FFF" />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Remember Password</Text>
          <Switch value={rememberPassword} onValueChange={setRememberPassword} trackColor={{ false: '#E0E0E0', true: '#2558B5' }} thumbColor="#FFF" />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Touch ID</Text>
          <Switch value={touchId} onValueChange={setTouchId} trackColor={{ false: '#E0E0E0', true: '#2558B5' }} thumbColor="#FFF" />
        </View>

        <Pressable style={styles.changePasswordBtn} onPress={() => router.push('/forgot-password' as any)}>
          <Text style={styles.changePasswordText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={18} color="#2558B5" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  rowLabel: { fontSize: 16, color: '#1A1A1A' },
  changePasswordBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, marginTop: 20 },
  changePasswordText: { fontSize: 16, fontWeight: '600', color: '#2558B5' },
});
