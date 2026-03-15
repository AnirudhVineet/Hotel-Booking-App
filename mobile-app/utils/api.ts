


import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Replace this with your actual Render URL after deployment (e.g., https://dawatime-backend.onrender.com/api)
const BASE_URL = 'https://YOUR_APP_NAME.onrender.com/api';
const TOKEN_KEY = 'dawatime_auth_token';


/** Save token to device storage after login/register */
export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

/** Retrieve the stored token */
export async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

/** Remove the token (logout) */
export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ─── BASE REQUEST FUNCTION ──────────────────────────────────────────

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}


async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true', // Required for localtunnel to skip security page
    ...(options.headers as Record<string, string>),
  };

  // Attach the token if we have one
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check if the response is actually JSON before parsing
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Cannot connect to server. Please check that the backend and tunnel are running.');
    }

    const json = await response.json();

    // If the server returned an error, throw it so callers can catch
    if (!response.ok) {
      throw new Error(json.message || 'Something went wrong');
    }

    return json;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle network errors gracefully (phone can't reach backend)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check that the backend server is running.');
    }
    if (error.message === 'Network request failed') {
      throw new Error('Cannot connect to server. Please check your network connection and that the backend is running.');
    }
    throw error;
  }
}


/** Register a new user account */
export async function register(name: string, email: string, password: string) {
  const response = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  // Auto-save the token on successful registration
  if (response.data?.token) {
    await saveToken(response.data.token);
  }
  return response;
}

/** Login with email and password */
export async function login(email: string, password: string) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // Auto-save the token on successful login
  if (response.data?.token) {
    await saveToken(response.data.token);
  }
  return response;
}

/** Request a password reset OTP */
export async function forgotPassword(email: string) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/** Verify an OTP code */
export async function verifyOtp(email: string, otp: string) {
  return request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

/** Reset password with OTP verification */
export async function resetPassword(email: string, otp: string, newPassword: string) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

/** Get the current user's profile */
export async function getProfile() {
  return request('/auth/me');
}

/** Logout — removes the stored token */
export async function logout() {
  await removeToken();
}


/** Get all hotels, optionally filtered by category or search query */
export async function getHotels(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);
  const queryString = params.toString();
  return request(`/hotels${queryString ? `?${queryString}` : ''}`);
}

/** Get a single hotel by ID */
export async function getHotelById(id: string) {
  return request(`/hotels/${id}`);
}


/** Create a new booking for a hotel */
export async function createBooking(hotelId: string) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify({ hotelId }),
  });
}

/** Get all bookings for the current user */
export async function getBookings() {
  return request('/bookings');
}

/** Remove a booking by its ID */
export async function removeBooking(bookingId: string) {
  return request(`/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}


/** Check if the backend server is reachable. Returns true/false. */
export async function checkHealth(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      headers: { 'bypass-tunnel-reminder': 'true' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return false;
    const json = await response.json();
    return json.success === true;
  } catch {
    clearTimeout(timeoutId);
    return false;
  }
}


export const api = {
  // Auth
  register,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
  // Token management
  saveToken,
  getToken,
  removeToken,
  // Hotels
  getHotels,
  getHotelById,
  // Bookings
  createBooking,
  getBookings,
  removeBooking,
  // Health
  checkHealth,
};
