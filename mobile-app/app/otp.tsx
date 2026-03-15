import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/utils/api';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  const handleNext = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 4) {
      Alert.alert('Error', 'Please enter the full 4-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await api.verifyOtp(email || '', otpCode);
      // Navigate to new-password screen, passing email and OTP
      router.push({ pathname: '/new-password', params: { email, otp: otpCode } } as any);
    } catch (err: any) {
      Alert.alert('Invalid OTP', err.message || 'The OTP code is incorrect or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input
    if (text !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header with Back Button */}
        <Pressable onPress={handleBack} style={styles.backButtonContainer} hitSlop={20}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We have just sent you 4 digit code via your email example@gmail.com
          </Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
              style={[styles.otpInput, digit !== '' && styles.otpInputFilled]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Main Action */}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Continue'}</Text>
        </Pressable>
        
        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>{"Didn't receive code? "}</Text>
          <Pressable hitSlop={10}>
             <Text style={styles.resendLink}>Resend Code</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY_BLUE = '#2558B5';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  backButtonContainer: {
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  otpInputFilled: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
  },
  button: {
    backgroundColor: PRIMARY_BLUE,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  resendLink: {
     fontSize: 14,
     color: PRIMARY_BLUE,
     fontWeight: '700',
  }
});
