import { Stack } from 'expo-router';

export default function HotelLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="facilities" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="reviews" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
