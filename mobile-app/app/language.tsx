import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUGGESTED = [
  { code: 'en-uk', label: 'English (UK)', selected: true },
  { code: 'en', label: 'English', selected: false },
  { code: 'id', label: 'Bahasa Indonesia', selected: false },
];

const OTHER = [
  { code: 'zh', label: 'Chinese' },
  { code: 'hr', label: 'Croatian' },
  { code: 'cs', label: 'Czech' },
  { code: 'da', label: 'Danish' },
  { code: 'fil', label: 'Filipino' },
  { code: 'fi', label: 'Finland' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('en-uk');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Suggested Languages</Text>
        {SUGGESTED.map((lang) => (
          <Pressable key={lang.code} style={styles.langItem} onPress={() => setSelected(lang.code)}>
            <Text style={styles.langText}>{lang.label}</Text>
            {selected === lang.code && <Ionicons name="checkmark" size={22} color="#2558B5" />}
          </Pressable>
        ))}

        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Other Languages</Text>
        {OTHER.map((lang) => (
          <Pressable key={lang.code} style={styles.langItem} onPress={() => setSelected(lang.code)}>
            <Text style={styles.langText}>{lang.label}</Text>
            {selected === lang.code && <Ionicons name="checkmark" size={22} color="#2558B5" />}
          </Pressable>
        ))}
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
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#999', marginBottom: 12 },
  langItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  langText: { fontSize: 16, color: '#1A1A1A' },
});
