export interface UserAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  location: string;
  avatarUrl: string;
  addresses: UserAddress[];
  joinedAt: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DayAvailability {
  id: string;
  dayName: string; // e.g. "We", "Th", "Fr"
  dateNumber: number; // e.g. 5, 6, 7
  isAvailable: boolean;
  slots: string[];
}

export interface Destination {
  id: string;
  title: string;
  category: 'hiking' | 'kayaking' | 'camping' | 'surfing';
  locationName: string;
  country: string;
  rating: number;
  reviewCount: number;
  description: string;
  pricePerPerson: number;
  availabilityHours: string; // e.g. "MON - SAT • 10:00 - 17:00"
  imageUrl: string;
  images: string[]; // additional images for image gallery
  isPopular: boolean;
  isRecommended: boolean;
  reviews: Review[];
  availabilityCalendar: DayAvailability[];
}

export interface Category {
  id: 'hiking' | 'kayaking' | 'camping' | 'surfing';
  label: string;
  icon: string;
  iconType: 'fa6' | 'ionicons' | 'material';
}

export interface NotificationItem {
  id: string;
  type: 'booking' | 'discount' | 'alert';
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export interface GuestOption {
  id: 'adults' | 'children';
  label: string;
  subLabel: string;
  count: number;
  minCount: number;
  maxCount: number;
}

// ----------------------------------------------------
// Mock Data Records
// ----------------------------------------------------

export const MOCK_USER: UserProfile = {
  id: 'user_01',
  fullName: 'Brandon Smith',
  email: 'brandon.smith@travelapp.com',
  location: 'BALI, INDONESIA',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  addresses: [
    {
      id: 'addr_1',
      label: 'Home',
      address: '123 Sunset Boulevard, Kuta, Bali, 80361',
      isDefault: true,
    },
    {
      id: 'addr_2',
      label: 'Office',
      address: 'Creative Hub Coworking, Floor 3, Canggu, Bali, 80351',
      isDefault: false,
    }
  ],
  joinedAt: 'March 2025',
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 'hiking', label: 'HIKING', icon: 'person-hiking', iconType: 'fa6' },
  { id: 'kayaking', label: 'KAYAKING', icon: 'boat-outline', iconType: 'ionicons' },
  { id: 'camping', label: 'CAMPING', icon: 'campground', iconType: 'fa6' },
  { id: 'surfing', label: 'SURFING', icon: 'water', iconType: 'fa6' },
];

const DEFAULT_CALENDAR: DayAvailability[] = [
  { id: 'cal_1', dayName: 'We', dateNumber: 5, isAvailable: true, slots: ['10:00', '13:00', '16:00'] },
  { id: 'cal_2', dayName: 'Th', dateNumber: 6, isAvailable: true, slots: ['11:00', '14:00', '17:00'] },
  { id: 'cal_3', dayName: 'Fr', dateNumber: 7, isAvailable: false, slots: [] },
  { id: 'cal_4', dayName: 'Sa', dateNumber: 8, isAvailable: true, slots: ['10:00', '12:00', '15:00'] },
  { id: 'cal_5', dayName: 'Su', dateNumber: 9, isAvailable: false, slots: [] },
  { id: 'cal_6', dayName: 'Mo', dateNumber: 10, isAvailable: true, slots: ['09:00', '13:00', '16:00'] },
  { id: 'cal_7', dayName: 'Tu', dateNumber: 11, isAvailable: true, slots: ['10:00', '14:00', '17:00'] },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Absolutely breathtaking! The views were spectacular, and the local guides were incredibly knowledgeable and friendly.',
    date: 'May 12, 2026',
  },
  {
    id: 'rev_2',
    userName: 'David Miller',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.5,
    comment: 'A really wonderful trip. Very well organized, with plenty of options to explore at our own pace.',
    date: 'May 08, 2026',
  }
];

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'dest_1',
    title: 'The Beauty of Natural Landscape',
    category: 'hiking',
    locationName: 'Caracas',
    country: 'Venezuela',
    rating: 4.6,
    reviewCount: 142,
    description: 'Explore the majestic ridges of Avila National Park, rising high above the vibrant valley of Caracas. Experience a diverse microclimate, rich tropical biodiversity, and panoramic views stretching out to the Caribbean Sea. This guided trail features intermediate climbs, scenic picnic spots, and a cable car descent option.',
    pricePerPerson: 35,
    availabilityHours: 'MON - SUN • 07:00 - 16:00',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: true,
    isRecommended: false,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  },
  {
    id: 'dest_2',
    title: 'Explore The Cultural Katara Village',
    category: 'camping',
    locationName: 'Doha',
    country: 'Qatar',
    rating: 4.5,
    reviewCount: 98,
    description: 'Immerse yourself in Qatars premier cultural destination. Katara Cultural Village features stunning amphitheaters, beautiful mosques, art galleries, and a serene beachfront. When evening falls, experience luxury Bedouin-style glamping under the desert stars with local delicacies, traditional music, and premium hospitality.',
    pricePerPerson: 120,
    availabilityHours: 'ALL DAYS • 14:00 - 23:00',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: true,
    isRecommended: false,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  },
  {
    id: 'dest_3',
    title: 'Prague City Tour',
    category: 'kayaking',
    locationName: 'Prague',
    country: 'Czech Republic',
    rating: 4.7,
    reviewCount: 320,
    description: 'Discover the "City of a Hundred Spires" from a unique vantage point on the Vltava River. Paddle through historic canals, under the iconic Charles Bridge, and admire the majestic Prague Castle rising in the background. A perfect blend of gentle sports adventure and fascinating European history guided by professionals.',
    pricePerPerson: 45,
    availabilityHours: 'MON - SAT • 09:00 - 18:00',
    imageUrl: 'https://images.unsplash.com/photo-1541343072077-27c18d87accb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541343072077-27c18d87accb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513807016779-d51c0c026263?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: false,
    isRecommended: true,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  },
  {
    id: 'dest_4',
    title: 'Eiffel Tower Night Cruise',
    category: 'kayaking',
    locationName: 'Paris',
    country: 'France',
    rating: 4.8,
    reviewCount: 450,
    description: 'Set out on a premium evening kayaking journey along the River Seine. As Paris lights up, you will paddle gently past glowing architectural wonders like Notre-Dame, the Louvre, and finish right beneath the spectacular sparkling displays of the Eiffel Tower. Unmatched romance, security, and beauty.',
    pricePerPerson: 65,
    availabilityHours: 'THU - SUN • 20:00 - 23:00',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9647a64db0?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: false,
    isRecommended: true,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  },
  {
    id: 'dest_5',
    title: 'Snorkeling at Kuta Beach',
    category: 'surfing',
    locationName: 'Bali',
    country: 'Indonesia',
    rating: 4.8,
    reviewCount: 512,
    description: 'Unveil the vibrant underwater wonders of Kutas reef ecosystems. Swim alongside majestic sea turtles, navigate colorful schools of tropical reef fish, and discover breathtaking coral gardens. Perfect for beginner snorkelers, this excursion includes all professional gear, refreshments, and a certified diving guide.',
    pricePerPerson: 40,
    availabilityHours: 'MON - SUN • 08:00 - 17:00',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: false,
    isRecommended: false,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  },
  {
    id: 'dest_6',
    title: 'Experience Antelope Canyon',
    category: 'hiking',
    locationName: 'Arizona',
    country: 'United States',
    rating: 4.9,
    reviewCount: 840,
    description: 'Step into the sublime, wave-like sandstone structures of Upper Antelope Canyon. Wander through narrow passageways illuminated by heavenly sunbeams filtering down from above. Led by Navajo native guides, learn the deep geological history and spiritual legacy of these iconic slot canyons.',
    pricePerPerson: 95,
    availabilityHours: 'MON - SUN • 08:00 - 16:00',
    imageUrl: 'https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: false,
    isRecommended: false,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  },
  {
    id: 'dest_7',
    title: 'Pragser Wildsee Alpine Lake',
    category: 'kayaking',
    locationName: 'South Tyrol',
    country: 'Italy',
    rating: 4.7,
    reviewCount: 680,
    description: 'Known as the Pearl of the Dolomite Lakes, Pragser Wildsee boasts dazzling emerald waters surrounded by colossal rock faces. Rent a classic handcrafted wooden rowboat or hop in a premium kayak to explore the quiet corners of this alpine wonderland. Truly a photographer’s absolute dream landscape.',
    pricePerPerson: 55,
    availabilityHours: 'MON - SUN • 09:00 - 17:00',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: false,
    isRecommended: false,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  },
  {
    id: 'dest_8',
    title: 'Yosemite Pine Camping',
    category: 'camping',
    locationName: 'California',
    country: 'United States',
    rating: 4.9,
    reviewCount: 390,
    description: 'Camp in the heart of Yosemite Valley under towering sugar pines and giant sequoias. Gaze up at the sheer granite walls of El Capitan and Half Dome, and wake to the thundering sounds of nearby waterfalls. Our camps feature raised canvas tents, cozy fire pits, and fully secure wilderness amenities.',
    pricePerPerson: 75,
    availabilityHours: 'ALL DAYS • 24 HOURS',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=800&q=80'
    ],
    isPopular: false,
    isRecommended: false,
    reviews: MOCK_REVIEWS,
    availabilityCalendar: DEFAULT_CALENDAR,
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'booking',
    title: 'Booking Confirmed!',
    description: 'Your trip to Pragser Wildsee, Italy on May 25 is successfully booked.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'notif_2',
    type: 'discount',
    title: 'Summer Special Discount',
    description: 'Get 20% off on all water sports activities in Bali, Indonesia. Use code SUMMER20.',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 'notif_3',
    type: 'alert',
    title: 'Weather Update: Chamonix',
    description: 'Perfect snowy conditions are expected for hiking this weekend in South France.',
    time: '3 days ago',
    unread: false,
  },
];

export const MOCK_GUEST_OPTIONS: GuestOption[] = [
  {
    id: 'adults',
    label: 'Adult',
    subLabel: 'Age 13 or above',
    count: 2,
    minCount: 1,
    maxCount: 10,
  },
  {
    id: 'children',
    label: 'Children',
    subLabel: 'Under 2 years old',
    count: 1,
    minCount: 0,
    maxCount: 5,
  }
];
