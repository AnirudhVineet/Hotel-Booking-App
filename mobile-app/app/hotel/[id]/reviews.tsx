import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const REVIEWS_DATA = [
  {
    id: '1',
    name: 'Kim Borrdy',
    avatar: 'https://i.pravatar.cc/150?img=68',
    rating: '4.5',
    text: 'Amazing! The room is good than the picture. Thanks for amazing experience!',
  },
  {
    id: '2',
    name: 'Mirai Kamazuki',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: '5.0',
    text: 'The service is on point, and I really like the facilities. Good job!',
  },
  {
    id: '3',
    name: 'Jzenklen',
    avatar: 'https://i.pravatar.cc/150?img=33',
    rating: '5.0',
    text: 'The service is on point, and I really like the facilities. Good job!',
  },
  {
    id: '4',
    name: 'Rezikan Akay',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rating: '5.0',
    text: 'The service is on point, and I really like the facilities. Good job!',
  },
  {
    id: '5',
    name: 'Rezingkaly',
    avatar: 'https://i.pravatar.cc/150?img=14',
    rating: '5.0',
    text: 'The service is on point, and I really like the facilities. Good job!',
  },
  {
    id: '6',
    name: 'Andiziky',
    avatar: 'https://i.pravatar.cc/150?img=44',
    rating: '5.0',
    text: 'The service is on point, and I really like the facilities. Good job!',
  },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Reviews</Text>
        <Pressable style={[styles.headerBtn, { alignItems: 'flex-end' }]}>
          <Ionicons name="filter" size={20} color="#1A1A1A" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Rating Summary Graph */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryLeft}>
            <Text style={styles.avgScore}>4.4</Text>
            <View style={styles.starsRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#EAEAEA" />
            </View>
            <Text style={styles.totalReviews}>Based on 532 review</Text>
          </View>

          <View style={styles.summaryRight}>
             {/* 5 Stars */}
             <View style={styles.barRow}>
               <Text style={styles.barLabel}>5</Text>
               <View style={styles.barBg}>
                 <View style={[styles.barFill, { width: '80%' }]} />
               </View>
             </View>
             {/* 4 Stars */}
             <View style={styles.barRow}>
               <Text style={styles.barLabel}>4</Text>
               <View style={styles.barBg}>
                 <View style={[styles.barFill, { width: '60%' }]} />
               </View>
             </View>
             {/* 3 Stars */}
             <View style={styles.barRow}>
               <Text style={styles.barLabel}>3</Text>
               <View style={styles.barBg}>
                 <View style={[styles.barFill, { width: '25%' }]} />
               </View>
             </View>
             {/* 2 Stars */}
             <View style={styles.barRow}>
               <Text style={styles.barLabel}>2</Text>
               <View style={styles.barBg}>
                 <View style={[styles.barFill, { width: '10%' }]} />
               </View>
             </View>
             {/* 1 Stars */}
             <View style={styles.barRow}>
               <Text style={styles.barLabel}>1</Text>
               <View style={styles.barBg}>
                 <View style={[styles.barFill, { width: '2%' }]} />
               </View>
             </View>
          </View>
        </View>

        {/* Reviews List */}
        <Text style={styles.listTitle}>Reviews (532)</Text>
        
        {REVIEWS_DATA.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
            <View style={styles.reviewContent}>
               <View style={styles.reviewHeaderInfo}>
                 <Text style={styles.reviewerName}>{review.name}</Text>
                 <View style={styles.reviewRatingBadge}>
                   <Ionicons name="star" size={12} color="#FFD700" />
                   <Text style={styles.reviewRatingText}>{review.rating}</Text>
                 </View>
               </View>
               <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const PRIMARY_BLUE = '#2558B5';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
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
  
  // Summary block
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  summaryLeft: {
    flex: 1,
  },
  avgScore: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 4,
  },
  totalReviews: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  summaryRight: {
    width: 140,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
    width: 12, // Fixed width for alignment
    marginRight: 8,
  },
  barBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  barFill: {
    height: '100%',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 2,
  },

  // List Title
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },

  // Review List Items
  reviewCard: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
});
