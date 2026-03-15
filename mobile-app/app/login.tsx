import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { navQueuePush, navQueueBack, navQueueReset } from '../utils/navQueue';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Register this screen in the nav queue when it loads
    navQueuePush('login');

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const prev = navQueueBack(); // pop current, get previous
      if (prev === 'signup') {
        router.replace('/signup');
      } else {
        router.replace('/'); // queue empty → go home
      }
      return true;
    });

    return () => subscription.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => {
    const prev = navQueueBack();
    if (prev === 'signup') {
      router.replace('/signup');
    } else {
      router.replace('/'); 
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
          <Text style={styles.title}>Let's Sign you in</Text>
          <Text style={styles.subtitle}>Sign in to access your bookings and travel preferences.</Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your password"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
            />
            <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)} hitSlop={10}>
              <Ionicons
                name={secureTextEntry ? 'eye-off' : 'eye'}
                size={20}
                color="#000"
              />
            </Pressable>
          </View>

          {/* Options Row */}
          <View style={styles.optionsRow}>
            <Pressable
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              hitSlop={5}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/forgot-password' as any)} hitSlop={5}>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </Pressable>
          </View>

          {/* Main Action */}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={async () => {
              if (!email.trim() || !password.trim()) {
                Alert.alert('Error', 'Please enter both email and password.');
                return;
              }
              setLoading(true);
              try {
                const response = await api.login(email.trim(), password);
                setUser(response.data?.user || null);
                navQueueReset();
                router.replace('/(tabs)' as any);
              } catch (err: any) {
                Alert.alert('Login Failed', err.message || 'Invalid email or password.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </Pressable>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/signup')} hitSlop={10}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>

        {/* Social Options */}
        <View style={styles.socialContainer}>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or Sign In with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <Pressable style={styles.socialBtn}>
              <FontAwesome5 name="google" size={24} color="#DB4437" />
            </Pressable>
            <Pressable style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={26} color="#000" />
            </Pressable>
            <Pressable style={styles.socialBtn}>
              <FontAwesome5 name="facebook-f" size={24} color="#4267B2" />
            </Pressable>
          </View>

          <Text style={styles.termsText}>
            By signing up you agree to our <Text style={styles.bold}>Terms</Text>{'\n'}and <Text style={styles.bold}>Conditions of Use</Text>
          </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  forgotText: {
    fontSize: 14,
    color: '#FF3B30', // Red color matching design
    fontWeight: '500',
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  registerLink: {
    fontSize: 15,
    color: PRIMARY_BLUE,
    fontWeight: '700',
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  dividerText: {
    color: '#A0A0A0',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  socialBtn: {
    width: 70,
    height: 56,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
