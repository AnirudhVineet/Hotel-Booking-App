import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FACILITIES_DATA = [
  {
    id: '1',
    category: 'Food and Drink',
    count: 4,
    icon: 'restaurant-outline',
    items: ['A la carte dinner', 'A la carte lunch', 'Breakfast', 'Vegetarian meal'],
  },
  {
    id: '2',
    category: 'Transportation',
    count: 5,
    icon: 'car-sport-outline',
    items: ['Airport pickup', 'Bicycle rental', 'Car rental', 'Shuttle service', 'Taxi service'],
  },
  {
    id: '3',
    category: 'General',
    count: 8,
    icon: 'settings-outline',
    items: ['Air conditioning', 'Heating', 'Elevator', 'Non-smoking rooms', 'Family rooms'],
  },
  {
    id: '4',
    category: 'Hotel Service',
    count: 2,
    icon: 'business-outline',
    items: ['Concierge', 'Luggage storage'],
  },
  {
    id: '5',
    category: 'Bussines Facilities',
    count: 6,
    icon: 'briefcase-outline',
    items: ['Meeting rooms', 'Fax/photocopying'],
  },
  {
    id: '6',
    category: 'Nearby facilities',
    count: 8,
    icon: 'map-outline',
    items: ['ATM', 'Convenience store'],
  },
  {
    id: '7',
    category: 'Kids',
    count: 3,
    icon: 'happy-outline',
    items: ['Kids club', 'Playground', 'Babysitting'],
  },
  {
    id: '8',
    category: 'Connectivity',
    count: 2,
    icon: 'wifi-outline',
    items: ['Free WiFi', 'Wired internet'],
  },
];

export default function FacilitiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Track expanded section by ID.  Default to first section open.
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const toggleSection = (id: string) => {
    setExpandedId(current => current === id ? null : id);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>All Facilities</Text>
        <View style={styles.headerBtn} /> {/* Empty view for centering */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {FACILITIES_DATA.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <View key={item.id} style={styles.accordionContainer}>
              <Pressable style={styles.accordionHeader} onPress={() => toggleSection(item.id)}>
                <View style={styles.accordionHeaderLeft}>
                  <Ionicons name={item.icon as any} size={20} color="#1A1A1A" />
                  <Text style={styles.accordionTitle}>{item.category}</Text>
                  <Text style={styles.accordionCount}>({item.count} facilities)</Text>
                </View>
                <Ionicons 
                  name={isExpanded ? "remove" : "add"} 
                  size={20} 
                  color="#1A1A1A" 
                />
              </Pressable>

              {isExpanded && (
                <View style={styles.accordionBody}>
                  {item.items.map((subItem, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.bulletText}>{subItem}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
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
    alignItems: 'flex-start',
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
  accordionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 12,
  },
  accordionCount: {
    fontSize: 13,
    color: '#A0A0A0',
    marginLeft: 6,
    fontWeight: '500',
  },
  accordionBody: {
    marginTop: 16,
    paddingLeft: 32, // align with text, bypassing icon
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#888',
    marginRight: 10,
  },
  bulletText: {
    fontSize: 14,
    color: '#666',
  },
});
