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

export default function SignupScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Register this screen in the nav queue when it loads
    navQueuePush('signup');

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const prev = navQueueBack(); // pop current, get previous
      if (prev === 'login') {
        router.replace('/login');
      } else {
        router.replace('/'); // queue empty → go home
      }
      return true;
    });

    return () => subscription.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Grand Hotel to start planning your next amazing stay.</Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#A0A0A0"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
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

          {/* Main Action */}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={async () => {
              if (!name.trim() || !email.trim() || !password.trim()) {
                Alert.alert('Error', 'All fields are required.');
                return;
              }
              if (password.length < 6) {
                Alert.alert('Error', 'Password must be at least 6 characters.');
                return;
              }
              setLoading(true);
              try {
                const response = await api.register(name.trim(), email.trim(), password);
                setUser(response.data?.user || null);
                navQueueReset();
                router.replace('/(tabs)' as any);
              } catch (err: any) {
                Alert.alert('Registration Failed', err.message || 'Could not create account.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create An Account'}</Text>
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/login')} hitSlop={10}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 24,
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
  button: {
    backgroundColor: PRIMARY_BLUE,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  loginLink: {
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
