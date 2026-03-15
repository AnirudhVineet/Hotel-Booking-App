import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

// --- DUMMY DATA ---
const CATEGORIES = [
  { id: '1', name: 'All', active: true },
  { id: '2', name: 'Villas', icon: 'home-outline' },
  { id: '3', name: 'Hotels', icon: 'business-outline' },
  { id: '4', name: 'Apartments', icon: 'business-sharp' },
];

const POPULAR_HOTELS = [
  {
    id: '1',
    title: 'The Horizon Retreat',
    location: 'Los Angeles, CA',
    price: '$480',
    rating: '4.5',
    image: require('../../assets/images/onboarding1.png'), // Reusing assets
  },
  {
    id: '2',
    title: 'Opal Grove Inn',
    location: 'San Diego, CA',
    price: '$190',
    rating: '4.5',
    image: require('../../assets/images/onboarding2.jpg'),
  },
  {
    id: '3',
    title: 'Azure Paradise',
    location: 'Miami, FL',
    price: '$550',
    rating: '4.8',
    image: require('../../assets/images/onboarding3.png'),
  },
  {
    id: '4',
    title: 'Crimson Peak Resort',
    location: 'Aspen, CO',
    price: '$720',
    rating: '4.9',
    image: require('../../assets/images/onboarding1.png'),
  },
];

const RECOMMENDED_HOTELS = [
  {
    id: 'r1',
    title: 'Serenity Sands',
    location: 'Honolulu, HI',
    price: '$270',
    rating: '4.0',
    image: require('../../assets/images/onboarding3.png'),
  },
  {
    id: 'r2',
    title: 'Elysian Suites',
    location: 'San Diego, CA',
    price: '$320',
    rating: '3.8',
    image: require('../../assets/images/onboarding2.jpg'),
  },
  {
    id: 'r3',
    title: 'Pine Haven Lodge',
    location: 'Denver, CO',
    price: '$150',
    rating: '4.2',
    image: require('../../assets/images/onboarding1.png'),
  },
  {
    id: 'r4',
    title: 'Crystal Clear Water',
    location: 'Malibu, CA',
    price: '$410',
    rating: '4.6',
    image: require('../../assets/images/onboarding3.png'),
  },
];

const BEST_TODAY_HOTELS = [
  {
    id: 'b1',
    title: 'Tranquil Shores',
    location: 'Santa Monica, CA...',
    price: '$120',
    originalPrice: '$199',
    rating: '4.4',
    reviews: '(532)',
    image: require('../../assets/images/onboarding1.png'),
  },
  {
    id: 'b2',
    title: 'Sunset Boulevard Inn',
    location: 'Los Angeles, CA',
    price: '$180',
    originalPrice: '$250',
    rating: '4.7',
    reviews: '(821)',
    image: require('../../assets/images/onboarding2.jpg'),
  },
  {
    id: 'b3',
    title: 'Mountain View Retreat',
    location: 'Seattle, WA',
    price: '$200',
    originalPrice: '$280',
    rating: '4.5',
    reviews: '(412)',
    image: require('../../assets/images/onboarding3.png'),
  },
  {
    id: 'b4',
    title: 'Downtown Oasis',
    location: 'New York, NY',
    price: '$350',
    originalPrice: '$450',
    rating: '4.3',
    reviews: '(940)',
    image: require('../../assets/images/onboarding1.png'),
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>{user?.name || 'Guest'}</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="search" size={20} color="#1A1A1A" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <View style={styles.notificationDot} />
              <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
            </Pressable>
          </View>
        </View>

        {/* BANNER */}
        <Pressable style={styles.bannerContainer}>
          <View style={styles.bannerIconContainer}>
             <Ionicons name="location" size={20} color="#FFF" />
          </View>
          <Text style={styles.bannerText}>{"You Can Change Your Location to\nshow nearby villas"}</Text>
          <Ionicons name="chevron-forward" size={20} color="#1A1A1A" />
        </Pressable>

        {/* MOST POPULAR SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most Popular</Text>
          <Pressable hitSlop={10}>
             <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        <FlatList
          data={POPULAR_HOTELS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <Pressable style={styles.popularCard} onPress={() => router.push(`/hotel/${item.id}` as any)}>
              <Image source={item.image} style={styles.popularImage} />
              <View style={styles.heartButton}>
                <Ionicons name="heart" size={16} color="#FF3B30" />
              </View>
              <View style={styles.popularTextOverlay}>
                 <Text style={styles.popularTitle}>{item.title}</Text>
                 <Text style={styles.popularLocation}>{item.location}</Text>
                 <View style={styles.popularBottomRow}>
                    <Text style={styles.popularPrice}>{item.price}<Text style={styles.perNightText}>/night</Text></Text>
                    <View style={styles.ratingBadge}>
                       <Ionicons name="star" size={12} color="#FFD700" />
                       <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                 </View>
              </View>
            </Pressable>
          )}
        />

        {/* RECOMMENDED FOR YOU SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Pressable hitSlop={10}>
             <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
           {CATEGORIES.map((category) => (
             <Pressable
               key={category.id}
               style={[
                 styles.categoryPill,
                 activeCategory === category.name && styles.categoryPillActive
               ]}
               onPress={() => setActiveCategory(category.name)}
             >
               {category.icon && (
                 <Ionicons 
                   name={category.icon as any} 
                   size={16} 
                   color={activeCategory === category.name ? '#FFF' : '#2558B5'} 
                   style={{ marginRight: 6 }}
                 />
               )}
               <Text style={[
                 styles.categoryText,
                 activeCategory === category.name && styles.categoryTextActive
               ]}>
                 {category.name}
               </Text>
             </Pressable>
           ))}
        </ScrollView>

        {/* Recommended Items */}
        {RECOMMENDED_HOTELS.map((hotel, index) => (
          <Pressable key={hotel.id} style={[styles.recommendedCard, index === RECOMMENDED_HOTELS.length - 1 && styles.mb20]} onPress={() => router.push(`/hotel/${hotel.id}` as any)}>
            <Image source={hotel.image} style={styles.recommendedImage} />
            <View style={styles.recommendedInfo}>
              <View style={styles.recommendedTitleRow}>
                <Text style={styles.recommendedTitle}>{hotel.title}</Text>
                <View style={styles.ratingRow}>
                   <Ionicons name="star" size={14} color="#FFD700" />
                   <Text style={styles.ratingTextDark}>{hotel.rating}</Text>
                </View>
              </View>
              <View style={styles.locationRowRecommended}>
                 <Ionicons name="location-outline" size={14} color="#666" />
                 <Text style={styles.locationTextAlt}>{hotel.location}</Text>
              </View>
              <Text style={styles.recommendedPrice}>{hotel.price} <Text style={styles.perNightTextDark}>/night</Text></Text>
            </View>
          </Pressable>
        ))}

        {/* HOTEL NEAR YOU SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hotel Near You</Text>
          <Pressable hitSlop={10}>
             <Text style={styles.seeAllText}>Open Map</Text>
          </Pressable>
        </View>

        <Pressable style={styles.mapContainer}>
          {/* Using UI static map image since React Native Maps requires native linking */}
          <View style={styles.dummyMap}>
             <Text style={styles.dummyMapText}>Dummy Map Area (Requires react-native-maps linking)</Text>
          </View>
        </Pressable>


        {/* BEST TODAY SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Today 🔥</Text>
          <Pressable hitSlop={10}>
             <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
           {BEST_TODAY_HOTELS.map((hotel) => (
             <Pressable key={hotel.id} style={styles.bestTodayCard} onPress={() => router.push(`/hotel/${hotel.id}` as any)}>
                <Image source={hotel.image} style={styles.bestTodayImage} />
                <View style={styles.bestTodayInfo}>
                  <Text style={styles.recommendedTitle} numberOfLines={1}>{hotel.title}</Text>
                  <View style={styles.locationRowRecommended}>
                     <Ionicons name="location-outline" size={14} color="#666" />
                     <Text style={styles.locationTextSmall}>{hotel.location}</Text>
                  </View>
                  <View style={styles.bestTodayBottomRow}>
                     <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingTextSmall}>{hotel.rating}</Text>
                        <Text style={styles.reviewText}>{hotel.reviews}</Text>
                     </View>
                     <View style={styles.priceRow}>
                        <Text style={styles.bestTodayPrice}>{hotel.price}</Text>
                        <Text style={styles.originalPrice}>{hotel.originalPrice}</Text>
                     </View>
                  </View>
                </View>
             </Pressable>
           ))}
        </ScrollView>
        
        {/* Extra padding for tab bar bottom clearance */}
        <View style={{ height: 20 }} />

      </ScrollView>
    </View>
  );
}

const PRIMARY_BLUE = '#2558B5';
const LIGHT_BLUE_BG = '#F0F5FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
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
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    zIndex: 1,
  },
  
  // Banner
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: LIGHT_BLUE_BG,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  bannerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 18,
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },

  // Most Popular List
  horizontalList: {
    paddingRight: 20,
    marginBottom: 28,
  },
  popularCard: {
    width: 220,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  popularImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularTextOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 40,
    // Note: linear gradient would be ideal here backing the text
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  popularLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  popularBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  perNightText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },

  // Categories
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginRight: 12,
    backgroundColor: '#FFF',
  },
  categoryPillActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },

  // Recommended List
  recommendedCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  mb20: {
    marginBottom: 28, // Extra margin before next section
  },
  recommendedImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  recommendedInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  recommendedTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingTextDark: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  locationRowRecommended: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTextAlt: {
    fontSize: 13,
    color: '#A0A0A0',
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_BLUE,
  },
  perNightTextDark: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
  },

  // Map Component
  mapContainer: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
  },
  dummyMap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0F0E6', // Light green representing map
    justifyContent: 'center',
    alignItems: 'center',
  },
  dummyMapText: {
    color: '#4A8D5F',
    fontWeight: '600',
  },

  // Best Today List
  bestTodayCard: {
    flexDirection: 'row',
    width: 280,
    height: 90,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 10,
    marginRight: 16,
    alignItems: 'center',
  },
  bestTodayImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  bestTodayInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTextSmall: {
    fontSize: 11,
    color: '#666',
    marginLeft: 2,
  },
  bestTodayBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ratingTextSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFA000',
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 11,
    color: '#A0A0A0',
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestTodayPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  originalPrice: {
    fontSize: 11,
    color: '#FF3B30',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
});
