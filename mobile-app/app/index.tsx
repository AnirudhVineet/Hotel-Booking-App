import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Luxury and Comfort,\nJust a Tap Away',
    subtitle:
      'Experience world-class hospitality and pristine accommodations that feel like a second home.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Book with Ease, Stay\nwith Style',
    subtitle:
      'Explore exclusive locations and reserve your perfect getaway in seconds.',
    image: require('../assets/images/onboarding2.jpg'),
  },
  {
    id: '3',
    title: 'Discover Your Dream\nHotel, Effortlessly',
    subtitle:
      'Curated selections tailored perfectly to your tastes, available 24/7.',
    image: require('../assets/images/onboarding3.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Splash Screen Animations
  const splashOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Start splash animation
    logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoOpacity.value = withTiming(1, { duration: 800 });

    // Fade out splash after 2.5 seconds
    splashOpacity.value = withDelay(
      2500,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(setShowSplash)(false);
        }
      })
    );
  }, []);

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    transform: [{ scale: showSplash ? 1 : 0 }], // Hide completely when done
    zIndex: showSplash ? 100 : -1,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push('/login');
    }
  };

  const RegistrationLink = () => {
    return (
      <View style={[styles.registrationContainer, { opacity: currentIndex === ONBOARDING_DATA.length - 1 ? 1 : 0 }]}>
        <Text style={styles.registrationText}>Don't have an account? </Text>
        <Pressable hitSlop={10} disabled={currentIndex !== ONBOARDING_DATA.length - 1} onPress={() => router.push('/signup')}>
          <Text style={styles.registerLink}>Register</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Splash Screen Overlay */}
      <Animated.View style={[styles.splashContainer, splashStyle]}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoInitials}>g</Text>
          </View>
          <Text style={styles.hotelName}>Grand Hotel</Text>
          <Text style={styles.hotelTagline}>Find Your Perfect Stay, Anytime, Anywhere</Text>
        </Animated.View>
      </Animated.View>

      {/* Onboarding Content */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.x;
          const index = Math.round(offset / width);
          if (index >= 0 && index < ONBOARDING_DATA.length) {
            setCurrentIndex(index);
          }
        }}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.page}>
              <Image source={item.image} style={styles.image} />
              {/* Gradient Overlay would go here in a real app to ensure text readability */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </Pressable>

        <RegistrationLink />
      </View>
    </View>
  );
}

const PRIMARY_BLUE = '#2558B5';
const BACKGROUND_GRADIENT = '#0A0A1A';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // SPLASH SCREEN
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoInitials: {
    fontSize: 50,
    color: '#FFF',
    fontStyle: 'italic',
    lineHeight: 65,
  },
  hotelName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  hotelTagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  // ONBOARDING SCREEN
  page: {
    width,
    height,
  },
  image: {
    width: '100%',
    height: '65%', // Image covers top 65%
    resizeMode: 'cover',
  },
  textContainer: {
    height: '35%',
    backgroundColor: BACKGROUND_GRADIENT,
    paddingHorizontal: 30,
    paddingTop: 40, // Increased top padding instead
    alignItems: 'center',
    // Removed paddingBottom entirely as it breaks layout constraints on Android
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10, // Added slight inward padding for text
  },

  // BOTTOM CONTROLS
  bottomControls: {
    position: 'absolute',
    bottom: 40, // Moved down slightly to give text more room
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 19,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: PRIMARY_BLUE,
  },
  button: {
    backgroundColor: PRIMARY_BLUE,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registrationContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  registrationText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  registerLink: {
    color: PRIMARY_BLUE,
    fontSize: 13,
    fontWeight: '600',
  },
});
