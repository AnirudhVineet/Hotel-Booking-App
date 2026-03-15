/**
 * ─── DATABASE SEEDER ────────────────────────────────────────────────
 * 
 * Seeds the hotels table with sample data that matches the dummy data
 * currently hardcoded in the React Native mobile app.
 * 
 * This runs once on server start — if hotels already exist it skips.
 */

const db = require('./database');

function seedHotels() {
  // Check if hotels already exist to avoid duplicates on restart
  const count = db.prepare('SELECT COUNT(*) as count FROM hotels').get();
  if (count.count > 0) {
    console.log('  ℹ  Hotels already seeded, skipping.');
    return;
  }

  console.log('  🌱 Seeding hotel data...');

  const insert = db.prepare(`
    INSERT INTO hotels (id, title, location, price, original_price, rating, reviews_count, description, category, image_url)
    VALUES (@id, @title, @location, @price, @originalPrice, @rating, @reviewsCount, @description, @category, @imageUrl)
  `);

  const hotels = [
    // ── Most Popular Hotels ──────────────────────────────────────
    {
      id: '1',
      title: 'The Horizon Retreat',
      location: 'Los Angeles, CA',
      price: '$480',
      originalPrice: null,
      rating: '4.5',
      reviewsCount: 245,
      description: 'Nestled in the heart of Los Angeles, The Horizon Retreat offers a luxurious escape with panoramic city views. Enjoy world-class amenities including an infinity pool, spa, and fine dining restaurant. Each room features modern décor with floor-to-ceiling windows.',
      category: 'Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    },
    {
      id: '2',
      title: 'Opal Grove Inn',
      location: 'San Diego, CA',
      price: '$190',
      originalPrice: null,
      rating: '4.5',
      reviewsCount: 178,
      description: 'A charming boutique hotel surrounded by lush gardens in San Diego. The Opal Grove Inn offers a peaceful retreat with comfortable rooms, a heated outdoor pool, and complimentary breakfast. Perfect for couples and solo travelers.',
      category: 'Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    },
    {
      id: '3',
      title: 'Azure Paradise',
      location: 'Miami, FL',
      price: '$550',
      originalPrice: null,
      rating: '4.8',
      reviewsCount: 312,
      description: 'Experience oceanfront luxury at Azure Paradise in Miami. This five-star resort features private beach access, multiple pools, a full-service spa, and gourmet restaurants. Wake up to stunning Atlantic Ocean views every morning.',
      category: 'Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    },
    {
      id: '4',
      title: 'Crimson Peak Resort',
      location: 'Aspen, CO',
      price: '$720',
      originalPrice: null,
      rating: '4.9',
      reviewsCount: 156,
      description: 'A premier mountain resort in Aspen offering ski-in/ski-out access, heated pools, and rustic-chic accommodations. Crimson Peak Resort combines adventure with relaxation in the heart of the Rocky Mountains.',
      category: 'Villas',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    },

    // ── Recommended Hotels ──────────────────────────────────────
    {
      id: 'r1',
      title: 'Serenity Sands',
      location: 'Honolulu, HI',
      price: '$270',
      originalPrice: null,
      rating: '4.0',
      reviewsCount: 98,
      description: 'Escape to paradise at Serenity Sands in Honolulu. This beachfront property offers direct access to pristine white-sand beaches, traditional Hawaiian hospitality, and stunning sunset views from every room.',
      category: 'Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    },
    {
      id: 'r2',
      title: 'Elysian Suites',
      location: 'San Diego, CA',
      price: '$320',
      originalPrice: null,
      rating: '3.8',
      reviewsCount: 134,
      description: 'Modern luxury meets California charm at Elysian Suites. Spacious suites with kitchenettes, a rooftop terrace with ocean views, and proximity to San Diego\'s top attractions make this the perfect base for exploration.',
      category: 'Apartments',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    },
    {
      id: 'r3',
      title: 'Pine Haven Lodge',
      location: 'Denver, CO',
      price: '$150',
      originalPrice: null,
      rating: '4.2',
      reviewsCount: 87,
      description: 'A cozy mountain lodge just outside Denver. Pine Haven offers rustic accommodations with modern comforts, hiking trails from the doorstep, and a warm fireplace lounge perfect for après-ski relaxation.',
      category: 'Villas',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    },
    {
      id: 'r4',
      title: 'Crystal Clear Water',
      location: 'Malibu, CA',
      price: '$410',
      originalPrice: null,
      rating: '4.6',
      reviewsCount: 203,
      description: 'Perched on the Malibu coastline, Crystal Clear Water offers unmatched ocean views and direct beach access. Enjoy surfing, beachside yoga, and farm-to-table dining at this eco-conscious luxury resort.',
      category: 'Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    },

    // ── Best Today Hotels ───────────────────────────────────────
    {
      id: 'b1',
      title: 'Tranquil Shores',
      location: 'Santa Monica, CA',
      price: '$120',
      originalPrice: '$199',
      rating: '4.4',
      reviewsCount: 532,
      description: 'Affordable beachfront luxury at Tranquil Shores. Located on the Santa Monica pier, this hotel offers ocean-view rooms, a heated pool, and complimentary bike rentals. Currently on special promotion!',
      category: 'Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    },
    {
      id: 'b2',
      title: 'Sunset Boulevard Inn',
      location: 'Los Angeles, CA',
      price: '$180',
      originalPrice: '$250',
      rating: '4.7',
      reviewsCount: 821,
      description: 'Stay on the iconic Sunset Boulevard in the heart of Hollywood. This boutique inn offers stylish rooms, a rooftop bar with panoramic views, and is walking distance to celebrity hotspots and entertainment venues.',
      category: 'Hotels',
      imageUrl: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
    },
    {
      id: 'b3',
      title: 'Mountain View Retreat',
      location: 'Seattle, WA',
      price: '$200',
      originalPrice: '$280',
      rating: '4.5',
      reviewsCount: 412,
      description: 'A peaceful retreat in the Pacific Northwest with stunning mountain and city views. Mountain View Retreat offers comfortable rooms, a farm-to-table restaurant, and easy access to Seattle\'s vibrant arts scene.',
      category: 'Villas',
      imageUrl: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',
    },
    {
      id: 'b4',
      title: 'Downtown Oasis',
      location: 'New York, NY',
      price: '$350',
      originalPrice: '$450',
      rating: '4.3',
      reviewsCount: 940,
      description: 'An urban sanctuary in the heart of Manhattan. Downtown Oasis offers sleek modern rooms, a spa, rooftop pool, and is steps away from Times Square, Central Park, and world-class shopping.',
      category: 'Apartments',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    },
  ];

  // Use a transaction for faster bulk inserts
  const insertMany = db.transaction((hotelList) => {
    for (const hotel of hotelList) {
      insert.run(hotel);
    }
  });

  insertMany(hotels);
  console.log(`  ✅ Seeded ${hotels.length} hotels successfully.`);
}

module.exports = { seedHotels };
