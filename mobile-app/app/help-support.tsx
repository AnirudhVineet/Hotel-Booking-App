import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FAQ = [
  { q: 'How do I book a hotel?', a: 'Simply browse the home screen, select a hotel you like, choose your dates, and click the "Book Now" button.' },
  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel your booking from the "My Bookings" section in your profile. Please check the hotel\'s cancellation policy for refund details.' },
  { q: 'Is my payment secure?', a: 'We use industry-standard encryption to protect your payment information. Your data is safe with us.' },
  { q: 'What if I have an issue during my stay?', a: 'You can reach out to the hotel directly using the contact information provided in your booking details, or contact our support team 24/7.' },
  { q: 'How do I update my profile?', a: 'Go to the profile tab and select "Personal Info" to update your name, email, or phone number.' },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Help and Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
        </View>

        {/* FAQ items */}
        {FAQ.map((item, i) => (
          <Pressable key={i} style={styles.faqItem} onPress={() => setExpanded(expanded === i ? null : i)}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.q}</Text>
              <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color="#999" />
            </View>
            {expanded === i && (
              <Text style={styles.faqAnswer}>{item.a}</Text>
            )}
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1A1A1A' },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingVertical: 16 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', flex: 1, marginRight: 10 },
  faqAnswer: { fontSize: 14, color: '#666', lineHeight: 22, marginTop: 10 },
});
