import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const CARDS = [
  {
    type: 'VISA',
    label: 'Current Balance',
    balance: '$3,242.23',
    number: '•••• 3507 4561 4220',
    expiry: '10/24',
    gradient: ['#2558B5', '#1A3D7C'],
  },
  {
    type: 'MASTERCARD',
    label: 'Current Balance',
    balance: '$4,570.80',
    number: '•••• 5435 4780 9168',
    expiry: '11/74',
    gradient: ['#1A1A2E', '#16213E'],
  },
];

export default function YourCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Your Card</Text>
        <Pressable style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#2558B5" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {CARDS.map((card, idx) => (
          <View key={idx} style={styles.cardWrapper}>
            <LinearGradient colors={card.gradient} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.cardTop}>
                <Text style={styles.cardLabel}>{card.label}</Text>
                <Text style={styles.cardType}>{card.type}</Text>
              </View>
              <Text style={styles.cardBalance}>{card.balance}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardNumber}>{card.number}</Text>
                <Text style={styles.cardExpiry}>{card.expiry}</Text>
              </View>
            </LinearGradient>
            <Pressable style={styles.defaultBtn}>
              <Ionicons name="radio-button-on" size={18} color="#2558B5" style={{ marginRight: 8 }} />
              <Text style={styles.defaultText}>Use as default payment method</Text>
            </Pressable>
          </View>
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
  addBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  content: { padding: 20, paddingBottom: 40 },
  cardWrapper: { marginBottom: 24 },
  card: { borderRadius: 16, padding: 20, minHeight: 180, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  cardType: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  cardBalance: { fontSize: 28, fontWeight: '800', color: '#FFF', marginVertical: 16 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNumber: { fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  cardExpiry: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  defaultBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingVertical: 4 },
  defaultText: { fontSize: 13, color: '#666' },
});
