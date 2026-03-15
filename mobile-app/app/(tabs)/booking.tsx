import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@/utils/api';

const { width } = Dimensions.get('window');

// Local image map — used to show images for hotels that came from the backend
const IMAGE_MAP: Record<string, any> = {
  '1': require('../../assets/images/onboarding1.png'),
  '2': require('../../assets/images/onboarding2.jpg'),
  '3': require('../../assets/images/onboarding3.png'),
  '4': require('../../assets/images/onboarding1.png'),
  'r1': require('../../assets/images/onboarding3.png'),
  'r2': require('../../assets/images/onboarding2.jpg'),
  'r3': require('../../assets/images/onboarding1.png'),
  'r4': require('../../assets/images/onboarding3.png'),
  'b1': require('../../assets/images/onboarding1.png'),
  'b2': require('../../assets/images/onboarding2.jpg'),
  'b3': require('../../assets/images/onboarding3.png'),
  'b4': require('../../assets/images/onboarding1.png'),
};

/**
 * ─── BOOKING SCREEN ─────────────────────────────────────────────────
 * Fetches bookings from the BACKEND so each user sees only their own.
 * Refreshes every time the tab is focused.
 */
export default function BookingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from backend every time this tab is focused
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          setLoading(true);
          const resp = await api.getBookings();
          if (active && resp.data) {
            setBookings(resp.data);
          }
        } catch {
          // If backend unreachable, show empty list silently
          if (active) setBookings([]);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [])
  );

  const handleRemove = (bookingId: string) => {
    Alert.alert(
      'Remove Booking',
      'Are you sure you want to remove this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.removeBooking(bookingId);
              setBookings(prev => prev.filter(b => b.booking_id !== bookingId));
              Alert.alert('Removed', 'Booking removed successfully.');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not remove booking.');
            }
          },
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/hotel/${item.hotel_id}` as any)}
    >
      <Image
        source={IMAGE_MAP[item.hotel_id] || require('../../assets/images/onboarding1.png')}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${item.price}</Text>
            <Pressable
              style={styles.removeCircle}
              onPress={() => handleRemove(item.booking_id)}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2558B5" />
          <Text style={[styles.emptyText, { marginTop: 12 }]}>Loading bookings...</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>You haven't booked any hotels yet.</Text>
          <Pressable
            style={styles.exploreBtn}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.exploreBtnText}>Explore Hotels</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.booking_id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2558B5',
    marginRight: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEBEB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  exploreBtn: {
    backgroundColor: '#2558B5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
