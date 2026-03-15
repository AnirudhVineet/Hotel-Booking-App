import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// --- DUMMY DATA ---
const MESSAGES_DATA = [
  {
    id: '1',
    name: 'Alice Johnson',
    message: 'Thanks for the booking! 😋',
    time: '7:12 Am',
    unread: 3,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Robert Wilson',
    message: 'Yes, the room is ready.',
    time: '9:28 Am',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Sarah Chen',
    message: 'The view is amazing here!',
    time: '4:35 Pm',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Mike Smith',
    message: 'Check out this epic suite.',
    time: '8:12 Pm',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Emma Davis',
    message: 'The breakfast was great.',
    time: '10:22 Pm',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    name: 'Chris Taylor',
    message: 'Looking forward to the stay!',
    time: 'yesterday',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

// Extra contacts for new message modal
const ALL_CONTACTS = [
  { id: '7', name: 'John Andrew', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Richard Kane', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '9', name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '10', name: 'David Park', avatar: 'https://i.pravatar.cc/150?img=10' },
  ...MESSAGES_DATA.map(m => ({ id: m.id, name: m.name, avatar: m.avatar })),
];

export default function MessageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [contactSearch, setContactSearch] = useState('');

  const filteredMessages = search
    ? MESSAGES_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    : MESSAGES_DATA;

  const filteredContacts = contactSearch
    ? ALL_CONTACTS.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()))
    : ALL_CONTACTS;

  const renderItem = ({ item }: { item: typeof MESSAGES_DATA[0] }) => (
    <Pressable
      style={styles.messageItem}
      onPress={() => router.push(`/chat?id=${item.id}` as any)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.message}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Message</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#A0A0A0"
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.searchDivider} />
          <Pressable style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#1A1A1A" />
          </Pressable>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        data={filteredMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB — New Message */}
      <Pressable
        style={[styles.fab, { bottom: 20 + insets.bottom }]}
        onPress={() => setShowNewMessage(true)}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </Pressable>

      {/* New Message Modal */}
      <Modal visible={showNewMessage} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <Pressable onPress={() => setShowNewMessage(false)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </Pressable>
            </View>

            <View style={styles.modalSearch}>
              <Ionicons name="search" size={18} color="#999" />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search contacts..."
                placeholderTextColor="#999"
                value={contactSearch}
                onChangeText={setContactSearch}
              />
            </View>

            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.contactItem}
                  onPress={() => {
                    setShowNewMessage(false);
                    setContactSearch('');
                    router.push(`/chat?id=${item.id}` as any);
                  }}
                >
                  <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
                  <Text style={styles.contactName}>{item.name}</Text>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2E3E5C', textAlign: 'center' },
  searchSection: { paddingHorizontal: 20, paddingVertical: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 30, borderWidth: 1, borderColor: '#F0F0F0', paddingHorizontal: 16, height: 54, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  searchDivider: { width: 1, height: 24, backgroundColor: '#F0F0F0', marginHorizontal: 10 },
  filterButton: { padding: 4 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  messageItem: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F9F9F9', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F0F0F0' },
  messageContent: { flex: 1, marginLeft: 16 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  timeText: { fontSize: 12, color: '#A0A0A0' },
  messageFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  messageText: { fontSize: 14, color: '#A0A0A0', flex: 1, marginRight: 8 },
  unreadBadge: { backgroundColor: '#FF2D55', minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  fab: { position: 'absolute', right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2558B5', justifyContent: 'center', alignItems: 'center', shadowColor: '#2558B5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },

  // New Message Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%', paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  modalSearch: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  modalSearchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1A1A1A' },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  contactAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#E0E0E0' },
  contactName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginLeft: 14 },
});
