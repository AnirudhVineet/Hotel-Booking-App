import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Hotel {
  id: string;
  title: string;
  location: string;
  rating: string;
  reviewsCount: number;
  price: string;
  description: string;
  image: any;
}

interface BookingContextType {
  bookings: Hotel[];
  bookHotel: (hotel: Hotel) => void;
  removeBooking: (hotelId: string) => void;
  isBooked: (hotelId: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Hotel[]>([]);

  const bookHotel = (hotel: Hotel) => {
    setBookings((prevBookings) => {
      // Avoid duplicate bookings
      if (prevBookings.some((b) => b.id === hotel.id)) {
        return prevBookings;
      }
      return [...prevBookings, hotel];
    });
  };

  const removeBooking = (hotelId: string) => {
    setBookings((prevBookings) => prevBookings.filter((b) => b.id !== hotelId));
  };

  const isBooked = (hotelId: string) => {
    return bookings.some((b) => b.id === hotelId);
  };

  return (
    <BookingContext.Provider value={{ bookings, bookHotel, removeBooking, isBooked }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
