import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, Image, FlatList, TextInput,
  Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const CONVERSATIONS: Record<string, { messages: any[]; hotel?: any }> = {
  '1': {
    hotel: {
      title: 'The Aston Vill Hotel',
      location: 'Veum Point, Michikoton',
      price: '$120',
      rating: '4.7',
    },
    messages: [
      { id: 'm1', text: 'Hi for this hotel with a king sweet room are there still any vacancies?', sender: 'me', time: '10:15 AM' },
      { id: 'm2', text: 'Hi Ahmir', sender: 'them', time: '10:30 AM' },
      { id: 'm3', text: 'Yes the room is available, so you can make an order.', sender: 'them', time: '10:31 AM' },
    ],
  },
  '2': {
    messages: [
      { id: 'm1', text: 'Hi! I\'d like to book a room for next weekend.', sender: 'me', time: '9:00 AM' },
      { id: 'm2', text: 'Yes! please take a order. We have rooms available.', sender: 'them', time: '9:28 AM' },
    ],
  },
  '3': {
    messages: [
      { id: 'm1', text: 'Have you been to the Azure Paradise hotel?', sender: 'me', time: '4:10 PM' },
      { id: 'm2', text: 'I think this one is good. The ocean views are incredible!', sender: 'them', time: '4:35 PM' },
    ],
  },
  '4': {
    messages: [
      { id: 'm1', text: 'Just checked into Opal Grove Inn!', sender: 'them', time: '7:50 PM' },
      { id: 'm2', text: 'Wow, this is really epic. Send me pictures!', sender: 'them', time: '8:12 PM' },
      { id: 'm3', text: 'The sunset view from my balcony 🌅', sender: 'me', time: '8:15 PM' },
    ],
  },
  '5': {
    messages: [
      { id: 'm1', text: 'Check out the pool at Crimson Peak Resort!', sender: 'me', time: '10:00 PM' },
      { id: 'm2', text: 'omg, this is amazing 😍', sender: 'them', time: '10:22 PM' },
    ],
  },
  '6': {
    messages: [
      { id: 'm1', text: 'Our trip is booked for next month!', sender: 'me', time: '3:00 PM' },
      { id: 'm2', text: 'woohoooo 🎉🎉', sender: 'them', time: '3:05 PM' },
    ],
  },
};

const CONTACTS: Record<string, { name: string; avatar: string }> = {
  '1': { name: 'Miss Dolores Schowalter', avatar: 'https://i.pravatar.cc/150?img=1' },
  '2': { name: 'Lorena Farrell', avatar: 'https://i.pravatar.cc/150?img=2' },
  '3': { name: 'Amos Hessel', avatar: 'https://i.pravatar.cc/150?img=3' },
  '4': { name: 'Ollie Haley', avatar: 'https://i.pravatar.cc/150?img=4' },
  '5': { name: 'Traci Maggio', avatar: 'https://i.pravatar.cc/150?img=5' },
  '6': { name: 'Mathew Konopelski', avatar: 'https://i.pravatar.cc/150?img=6' },
};

// Auto-reply responses
const AUTO_REPLIES = [
  'Sounds great! Let me check on that for you.',
  'I\'ll get back to you shortly with more details.',
  'That\'s a wonderful choice! 🏨',
  'Let me confirm the availability right away.',
  'Absolutely, I can help with that!',
  'Thank you for your message! 😊',
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chatId = typeof id === 'string' ? id : '1';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const contact = CONTACTS[chatId] || CONTACTS['1'];
  const convo = CONVERSATIONS[chatId] || CONVERSATIONS['1'];

  const [messages, setMessages] = useState(convo.messages);
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (!text.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      text: text.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setText('');

    // Auto-reply after a short delay
    setTimeout(() => {
      const reply = {
        id: `m${Date.now() + 1}`,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.bubbleRow, isMe && styles.bubbleRowMe]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
        </View>
        <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleLabel}>Chat</Text>
        </View>
        <Pressable style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color="#1A1A1A" />
        </Pressable>
      </View>

      {/* CONTACT BAR */}
      <View style={styles.contactBar}>
        <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contact.name.split(' ').slice(0, 2).join(' ')}</Text>
          <Text style={styles.contactStatus}>Online</Text>
        </View>
        <Pressable style={styles.contactAction}>
          <Ionicons name="videocam-outline" size={22} color="#1A1A1A" />
        </Pressable>
        <Pressable style={styles.contactAction}>
          <Ionicons name="call-outline" size={20} color="#1A1A1A" />
        </Pressable>
      </View>

      {/* MESSAGES */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListHeaderComponent={
          convo.hotel ? (
            <View style={styles.hotelCard}>
              <Image
                source={require('../assets/images/onboarding1.png')}
                style={styles.hotelImage}
              />
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelTitle}>{convo.hotel.title}</Text>
                <View style={styles.hotelLocationRow}>
                  <Ionicons name="location-outline" size={12} color="#999" />
                  <Text style={styles.hotelLocation}>{convo.hotel.location}</Text>
                </View>
                <Text style={styles.hotelPrice}>{convo.hotel.price}<Text style={styles.hotelPriceUnit}> /night</Text></Text>
              </View>
              <View style={styles.hotelRating}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.hotelRatingText}>{convo.hotel.rating}</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* INPUT BAR */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable style={styles.inputMic}>
          <Ionicons name="mic-outline" size={20} color="#999" />
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Write a reply"
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Pressable style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#FFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 50, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitleLabel: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerAction: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },

  // Contact bar
  contactBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  contactAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0E0E0' },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  contactStatus: { fontSize: 12, color: '#2558B5', marginTop: 2 },
  contactAction: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  // Message list
  messageList: { padding: 20, paddingBottom: 10 },

  // Hotel card
  hotelCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0', padding: 10, marginBottom: 20, alignItems: 'center' },
  hotelImage: { width: 60, height: 60, borderRadius: 10 },
  hotelInfo: { flex: 1, marginLeft: 10 },
  hotelTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  hotelLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  hotelLocation: { fontSize: 11, color: '#999', marginLeft: 3 },
  hotelPrice: { fontSize: 14, fontWeight: '800', color: '#2558B5', marginTop: 4 },
  hotelPriceUnit: { fontSize: 11, fontWeight: '400', color: '#999' },
  hotelRating: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FFF9E6', borderRadius: 8 },
  hotelRatingText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A', marginLeft: 3 },

  // Bubbles
  bubbleRow: { marginBottom: 6, alignItems: 'flex-start' },
  bubbleRowMe: { alignItems: 'flex-end' },
  bubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  bubbleMe: { backgroundColor: '#2558B5', borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#F5F5F5', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, color: '#1A1A1A', lineHeight: 22 },
  bubbleTextMe: { color: '#FFF' },
  bubbleTime: { fontSize: 11, color: '#999', marginTop: 4, marginLeft: 4 },
  bubbleTimeMe: { marginRight: 4, textAlign: 'right' },

  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FFF' },
  inputMic: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', backgroundColor: '#F5F5F5', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, marginHorizontal: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2558B5', justifyContent: 'center', alignItems: 'center' },
});
