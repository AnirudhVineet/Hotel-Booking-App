import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Platform, Pressable, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/utils/api';

const { width } = Dimensions.get('window');

// Extended dummy data for detail screen
const HOTEL_DATA: Record<string, any> = {
  '1': {
    title: 'The Aston Vill Hotel',
    location: 'Veum Point, Michikoton',
    rating: '4.6',
    reviewsCount: 532,
    price: '$120.00',
    description: 'The ideal place for those looking for a luxurious and tranquil holiday experience with stunning sea views. Enjoy our world-class amenities and pristine beaches.',
    image: require('../../../assets/images/onboarding1.png'),
  },
  '2': {
    title: 'Opal Grove Inn',
    location: 'San Diego, CA',
    rating: '4.5',
    reviewsCount: 342,
    price: '$190.00',
    description: 'A cozy getaway in the heart of San Diego. Perfect for a relaxing weekend or a business trip with easy access to the city.',
    image: require('../../../assets/images/onboarding2.jpg'),
  },
  '3': {
    title: 'Azure Paradise',
    location: 'Miami, FL',
    rating: '4.8',
    reviewsCount: 890,
    price: '$550.00',
    description: 'Experience the ultimate luxury in Miami. Azure Paradise offers breathtaking ocean views and unparalleled service.',
    image: require('../../../assets/images/onboarding3.png'),
  },
  '4': {
    title: 'Crimson Peak Resort',
    location: 'Aspen, CO',
    rating: '4.9',
    reviewsCount: 120,
    price: '$720.00',
    description: 'Breathtaking mountain views and ski-in/ski-out access.',
    image: require('../../../assets/images/onboarding1.png'),
  },
  // RECOMMENDED_HOTELS mapping
  'r1': {
    title: 'Serenity Sands',
    location: 'Honolulu, HI',
    rating: '4.0',
    reviewsCount: 210,
    price: '$270.00',
    description: 'Enjoy the bright sun and warm sands of Honolulu in this serene coastal retreat.',
    image: require('../../../assets/images/onboarding3.png'),
  },
  'r2': {
    title: 'Elysian Suites',
    location: 'San Diego, CA',
    rating: '3.8',
    reviewsCount: 156,
    price: '$320.00',
    description: 'Modern suites with premium service located right in the heart of San Diego.',
    image: require('../../../assets/images/onboarding2.jpg'),
  },
  'r3': {
    title: 'Pine Haven Lodge',
    location: 'Denver, CO',
    rating: '4.2',
    reviewsCount: 412,
    price: '$150.00',
    description: 'A beautiful lodge nestled in the quiet pine forests near Denver.',
    image: require('../../../assets/images/onboarding1.png'),
  },
  'r4': {
    title: 'Crystal Clear Water',
    location: 'Malibu, CA',
    rating: '4.6',
    reviewsCount: 301,
    price: '$410.00',
    description: 'Unobstructed ocean views and beachfront access in stunning Malibu.',
    image: require('../../../assets/images/onboarding3.png'),
  },
  // BEST_TODAY_HOTELS mapping
  'b1': {
    title: 'Tranquil Shores',
    location: 'Santa Monica, CA',
    rating: '4.4',
    reviewsCount: 532,
    price: '$120.00',
    description: 'Perfect for a weekend getaway along the beautiful shores of Santa Monica.',
    image: require('../../../assets/images/onboarding1.png'),
  },
  'b2': {
    title: 'Sunset Boulevard Inn',
    location: 'Los Angeles, CA',
    rating: '4.7',
    reviewsCount: 821,
    price: '$180.00',
    description: 'Prime location right on Sunset Boulevard with easy access to all Hollywood attractions.',
    image: require('../../../assets/images/onboarding2.jpg'),
  },
  'b3': {
    title: 'Mountain View Retreat',
    location: 'Seattle, WA',
    rating: '4.5',
    reviewsCount: 412,
    price: '$200.00',
    description: 'Overlooking breathtaking mountain ranges from the comfort of your private balcony.',
    image: require('../../../assets/images/onboarding3.png'),
  },
  'b4': {
    title: 'Downtown Oasis',
    location: 'New York, NY',
    rating: '4.3',
    reviewsCount: 940,
    price: '$350.00',
    description: 'A quiet, luxurious escape right in the bustling center of downtown New York.',
    image: require('../../../assets/images/onboarding1.png'),
  },
};

const DEFAULT_HOTEL = {
  title: 'The Aston Vill Hotel',
  location: 'Veum Point, Michikoton',
  rating: '4.6',
  reviewsCount: 532,
  price: '$120.00',
  description: 'The ideal place for those looking for a luxurious and tranquil holiday experience with stunning sea views.',
  image: require('../../../assets/images/onboarding1.png'),
};

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const hotel = (typeof id === 'string' && HOTEL_DATA[id]) ? { ...HOTEL_DATA[id], id } : { ...DEFAULT_HOTEL, id: '1' };

  // Check if this hotel is booked by the current user (from backend)
  useEffect(() => {
    (async () => {
      try {
        const resp = await api.getBookings();
        const found = resp.data?.find((b: any) => b.hotel_id === hotel.id);
        if (found) {
          setBooked(true);
          setBookingId(found.booking_id);
        } else {
          setBooked(false);
          setBookingId(null);
        }
      } catch {
        // If backend unreachable, default to not booked
      }
    })();
  }, [hotel.id]);

  const handleBooking = async () => {
    if (booked && bookingId) {
      Alert.alert(
        'Remove Booking',
        'Are you sure you want to remove this hotel from your bookings?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: async () => {
              try {
                await api.removeBooking(bookingId);
                setBooked(false);
                setBookingId(null);
                Alert.alert('Removed', 'Booking removed successfully.');
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Could not remove booking.');
              }
            }
          }
        ]
      );
      return;
    }
    try {
      await api.getHotelById(hotel.id); // Ensures flow state is hotel_viewed
      const resp = await api.createBooking(hotel.id);
      setBooked(true);
      setBookingId(resp.data?.bookingId || null);
      Alert.alert(
        'Success!',
        'Hotel booked successfully. View it in My Bookings.',
        [
          { text: 'OK' },
          { text: 'View Bookings', onPress: () => router.push('/(tabs)/booking') }
        ]
      );
    } catch (err: any) {
      Alert.alert('Booking Failed', err.message || 'Could not create booking.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO IMAGE SECTION */}
        <View style={styles.heroContainer}>
          <Image source={hotel.image} style={styles.heroImage} />
          
          {/* Header Overlay */}
          <View style={[styles.headerOverlay, { paddingTop: Math.max(insets.top, 20) }]}>
            <Pressable style={styles.headerButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Detail</Text>
            <Pressable style={styles.headerButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
            </Pressable>
          </View>
        </View>

        {/* INFO CARD (Overlapping Hero) */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.hotelTitle}>{hotel.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#2558B5" />
                <Text style={styles.locationText}>{hotel.location}</Text>
                <Ionicons name="star" size={14} color="#FFD700" style={{ marginLeft: 12 }} />
                <Text style={styles.ratingText}>{hotel.rating}</Text>
              </View>
            </View>
            <Pressable style={styles.mapIconBtn}>
              <Ionicons name="map-outline" size={20} color="#2558B5" />
            </Pressable>
          </View>
        </View>

        <View style={styles.contentPadding}>
          {/* COMMON FACILITIES */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Common Facilities</Text>
            <Pressable hitSlop={10} onPress={() => router.push(`/hotel/${id}/facilities` as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>

          <View style={styles.facilitiesRow}>
             <View style={styles.facilityItem}>
               <View style={styles.facilityIcon}>
                 <Ionicons name="snow-outline" size={24} color="#666" />
               </View>
               <Text style={styles.facilityText}>Ac</Text>
             </View>
             <View style={styles.facilityItem}>
               <View style={styles.facilityIcon}>
                 <Ionicons name="restaurant-outline" size={24} color="#666" />
               </View>
               <Text style={styles.facilityText}>Restaurant</Text>
             </View>
             <View style={styles.facilityItem}>
               <View style={styles.facilityIcon}>
                 <Ionicons name="water-outline" size={24} color="#666" />
               </View>
               <Text style={styles.facilityText}>Swimming{'\n'}Pool</Text>
             </View>
             <View style={styles.facilityItem}>
               <View style={styles.facilityIcon}>
                 <Ionicons name="time-outline" size={24} color="#666" />
               </View>
               <Text style={styles.facilityText}>24-Hours{'\n'}Front Desk</Text>
             </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {isExpanded ? hotel.description : `${hotel.description.slice(0, 100)}...`}
            <Text style={styles.readMoreText} onPress={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? " Read Less" : " Read More"}
            </Text>
          </Text>

          {/* LOCATION */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Pressable hitSlop={10}>
              <Text style={styles.seeAllText}>Open Map</Text>
            </Pressable>
          </View>
          
          <Pressable style={styles.mapContainer}>
            <View style={styles.dummyMap}>
              <Text style={styles.dummyMapText}>Map Placeholder UI</Text>
            </View>
            <View style={styles.mapAddressRow}>
               <Ionicons name="location" size={16} color="#2558B5" />
               <Text style={styles.mapAddressText}>9175 Chestnut Street, Rome, NY 13440</Text>
            </View>
          </Pressable>

          {/* REVIEWS PREVIEW */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Pressable hitSlop={10} onPress={() => router.push(`/hotel/${id}/reviews` as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=68' }} style={styles.reviewAvatar} />
              <View style={styles.reviewHeaderInfo}>
                <Text style={styles.reviewerName}>Kim Borrdy</Text>
                <View style={styles.reviewRatingBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.reviewRatingText}>4.5</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              Amazing! The room is good than the picture. Thanks for amazing experience!
            </Text>
          </View>

          <View style={[styles.reviewCard, { borderBottomWidth: 0 }]}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=47' }} style={styles.reviewAvatar} />
              <View style={styles.reviewHeaderInfo}>
                <Text style={styles.reviewerName}>Mirai Kamazuki</Text>
                <View style={styles.reviewRatingBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.reviewRatingText}>5.0</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              The service is on point, and I really like the facilities. Good job!
            </Text>
          </View>

          {/* RECOMMENDATION (Alternative) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <Pressable hitSlop={10}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 40 }}>
             <View style={styles.recCard}>
                <Image source={require('../../../assets/images/onboarding3.png')} style={styles.recImage} />
                <View style={styles.recInfo}>
                   <Text style={styles.recTitle}>Lumiere Palace</Text>
                   <View style={styles.recLocationRow}>
                      <Ionicons name="location-outline" size={12} color="#666" />
                      <Text style={styles.recLocationText}>Las Vegas, NV</Text>
                   </View>
                   <View style={styles.recBottomRow}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.recRatingText}>4.4 <Text style={styles.recReviewsText}>(532)</Text></Text>
                      <Text style={styles.recPrice}>$210 <Text style={styles.recOldPrice}>$345</Text></Text>
                   </View>
                </View>
             </View>
          </ScrollView>

        </View>
      </ScrollView>

      {/* FIXED BOTTOM BOOKING BAR */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.bottomBarContent}>
           <View style={styles.priceContainer}>
             <Text style={styles.priceLabel}>Price</Text>
             <Text style={styles.priceValue}>{hotel.price}</Text>
           </View>
           <Pressable 
             style={[styles.bookingBtn, booked && styles.bookedBtn]} 
             onPress={handleBooking}
           >
             <Text style={styles.bookingBtnText}>
               {booked ? 'Remove Booking' : 'Booking Now'}
             </Text>
           </Pressable>
        </View>
      </View>

    </View>
  );
}

const PRIMARY_BLUE = '#2558B5';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 100, // Make room for bottom bar
  },
  
  // Hero Image
  heroContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },

  // Info Card
  infoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -40, // overlap the image
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLeft: {
    flex: 1,
  },
  hotelTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  mapIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content Padding Wrapper
  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Shared Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12, // Default bottom margin for non-flexed titles
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },

  // Facilities
  facilitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  facilityItem: {
    alignItems: 'center',
    width: 70,
  },
  facilityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Description
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  readMoreText: {
    color: PRIMARY_BLUE,
    fontWeight: '600',
  },

  // Location Map
  mapContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  dummyMap: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0F0E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dummyMapText: {
    color: '#4A8D5F',
    fontWeight: '600',
  },
  mapAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  mapAddressText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },

  // Reviews
  reviewCard: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  reviewRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },

  // Recommendation Card
  recCard: {
    flexDirection: 'row',
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 12,
  },
  recImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  recInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recLocationText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginLeft: 4,
  },
  recBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  recReviewsText: {
    fontWeight: '400',
    color: '#A0A0A0',
  },
  recPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 'auto', // push to right
  },
  recOldPrice: {
    fontSize: 11,
    color: '#FF3B30',
    textDecorationLine: 'line-through',
  },

  // Bottom Fixed Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  bookingBtn: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  bookingBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bookedBtn: {
    backgroundColor: '#A0A0A0',
  },

});
