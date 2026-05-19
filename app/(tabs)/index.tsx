import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import '@/global.css';

// Mock Categories
const CATEGORIES = [
  { id: 'hiking', label: 'HIKING', icon: 'hiking', type: 'fa6' },
  { id: 'kayaking', label: 'KAYAKING', icon: 'rowing', type: 'material' },
  { id: 'camping', label: 'CAMPING', icon: 'campground', type: 'fa6' },
  { id: 'surfing', label: 'SURFING', icon: 'surfing', type: 'material' },
];

// Mock Popular Destinations
const POPULAR_DESTINATIONS = [
  {
    id: '1',
    title: 'The Beauty of Natural Landscape',
    location: 'Caracas, Venezuela',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Explore The Cultural Katara Village',
    location: 'Doha, Qatar',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
  },
];

// Mock Recommendations
const RECOMMENDATIONS = [
  {
    id: '3',
    country: 'CZECH REPUBLIC',
    title: 'Prague City Tour',
    rating: '4.5 OUT OF 5',
    imageUrl: 'https://images.unsplash.com/photo-1541343072077-27c18d87accb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '4',
    country: 'PARIS, FRANCE',
    title: 'Eiffel Tower Night Cruise',
    rating: '4.8 OUT OF 5',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80',
  },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('hiking');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        {/* Destinations Dropdown */}
        <Pressable className="flex-row items-center gap-1.5 active:opacity-75">
          <Text className="text-2xl font-bold text-brand-navy">Destinations</Text>
          <View className="flex-col leading-none items-center justify-center h-5 w-4">
            <Feather name="chevron-up" size={10} color="#2A3A4E" className="h-2" />
            <Feather name="chevron-down" size={10} color="#2A3A4E" className="h-2" />
          </View>
        </Pressable>

        {/* Filter Toggle with Badge */}
        <Pressable className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50 relative">
          <Ionicons name="filter-outline" size={22} color="#2A3A4E" style={{ transform: [{ scaleX: -1 }] }} />
          {/* Badge Dot */}
          <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand-orange border-2 border-white" />
        </Pressable>
      </View>

      {/* Main Scroll Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Search Input */}
        <View className="px-6 py-2">
          <View className="flex-row items-center bg-bg-gray px-4 py-3.5 rounded-2xl gap-3">
            <TextInput
              placeholder="Search Destination or Hotel"
              placeholderTextColor="#8D9CAE"
              className="flex-1 text-brand-navy text-base font-medium py-0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Feather name="search" size={20} color="#8D9CAE" />
          </View>
        </View>

        {/* What Are You Looking For Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center px-6 mb-4">
            <Text className="text-[17px] font-bold text-brand-navy">What Are You Looking For</Text>
            <Pressable className="active:opacity-70">
              <Text className="text-sm font-bold text-gray-sub/70">Show All</Text>
            </Pressable>
          </View>

          {/* Categories Horizontal Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className="items-center"
                >
                  {/* Category Circle Icon */}
                  <View
                    className={`w-[68px] h-[68px] rounded-full items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-brand-orange shadow-md shadow-brand-orange/30'
                        : 'bg-white border border-gray-100'
                    }`}
                  >
                    {cat.id === 'hiking' && (
                      <FontAwesome6 name="person-hiking" size={24} color={isSelected ? '#fff' : '#8D9CAE'} />
                    )}
                    {cat.id === 'kayaking' && (
                      <Ionicons name="boat-outline" size={24} color={isSelected ? '#fff' : '#8D9CAE'} />
                    )}
                    {cat.id === 'camping' && (
                      <FontAwesome6 name="campground" size={22} color={isSelected ? '#fff' : '#8D9CAE'} />
                    )}
                    {cat.id === 'surfing' && (
                      <FontAwesome6 name="water" size={22} color={isSelected ? '#fff' : '#8D9CAE'} />
                    )}
                  </View>
                  <Text className="text-[11px] font-bold text-gray-sub mt-2 tracking-wider">
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Popular Destinations */}
        <View className="mt-8">
          <Text className="text-[17px] font-bold text-brand-navy px-6 mb-4">Popular Destinations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}
            snapToInterval={280 + 20}
            decelerationRate="fast"
          >
            {POPULAR_DESTINATIONS.map((dest) => (
              <Pressable
                key={dest.id}
                className="w-[280px] h-[360px] rounded-[32px] overflow-hidden bg-peach-light/40 relative active:opacity-95"
              >
                <Image
                  source={{ uri: dest.imageUrl }}
                  className="w-full h-full"
                  contentFit="cover"
                  transition={250}
                />
                
                {/* Visual Gradient Overlay (Simulated via overlay View) */}
                <View className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent justify-end p-5">
                  <Text className="text-white text-lg font-bold mb-1.5 leading-6">
                    {dest.title}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location-sharp" size={14} color="#FFF" />
                    <Text className="text-[11px] font-semibold text-white/90">
                      {dest.location}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Recommendation Feed */}
        <View className="mt-8 px-6">
          <Text className="text-[17px] font-bold text-brand-navy mb-4">Recommendation</Text>
          <View className="gap-4">
            {RECOMMENDATIONS.map((item) => (
              <Pressable
                key={item.id}
                className="flex-row p-3 rounded-3xl border border-gray-50 bg-white items-center gap-4 active:bg-gray-50"
              >
                <View className="w-[84px] h-[84px] rounded-[20px] overflow-hidden bg-peach-light/30">
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-full"
                    contentFit="cover"
                    transition={200}
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-1 mb-1">
                    <Ionicons name="location-sharp" size={12} color="#FF7E4A" />
                    <Text className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                      {item.country}
                    </Text>
                  </View>
                  <Text className="text-base font-bold text-brand-navy mb-1.5" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    {/* Stars */}
                    <View className="flex-row gap-0.5 mr-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name="star" size={12} color="#FF7E4A" />
                      ))}
                    </View>
                    <Text className="text-[10px] font-bold text-gray-sub/70">
                      {item.rating}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
