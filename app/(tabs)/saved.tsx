import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import '@/global.css';

// Mock data representing Saved Items
const SAVED_ITEMS = [
  {
    id: '1',
    title: 'Snorkling at Kuta Beach',
    location: 'BALI, INDONESIA',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Experience Antelop Canyon',
    location: 'ARIZONA, UNITED STATES',
    imageUrl: 'https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Pragser Wildsee Alpine Lake',
    location: 'SOUTH TYROL, ITALY',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
  },
];

const CATEGORIES = ['Places', 'Hotels', 'Destinations', 'Tours'];

export default function SavedPlacesScreen() {
  const [activeTab, setActiveTab] = useState('Destinations');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Pressable className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50">
          <Feather name="chevron-left" size={24} color="#2A3A4E" />
        </Pressable>
        <Text className="text-xl font-bold text-brand-navy">Saved</Text>
        <Pressable className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50">
          <Ionicons name="grid-outline" size={20} color="#2A3A4E" />
        </Pressable>
      </View>

      {/* Search and Quick-Filter row */}
      <View className="flex-row px-6 py-2 gap-3">
        <View className="flex-1 flex-row items-center bg-bg-gray px-4 py-3 rounded-2xl gap-3">
          <Feather name="search" size={20} color="#8D9CAE" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#8D9CAE"
            className="flex-1 text-brand-navy text-base font-medium py-0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable className="w-14 h-14 bg-brand-orange items-center justify-center rounded-2xl shadow-sm shadow-brand-orange/20 active:opacity-90">
          <Feather name="sliders" size={20} color="#fff" style={{ transform: [{ rotate: '90deg' }] }} />
        </Pressable>
      </View>

      {/* Categories Horizontal Tabs */}
      <View className="my-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 24 }}
        >
          {CATEGORIES.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                className="items-center pb-2"
              >
                <Text
                  className={`text-base font-bold transition-colors ${
                    isActive ? 'text-brand-navy' : 'text-gray-sub'
                  }`}
                >
                  {tab}
                </Text>
                {isActive && (
                  <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1" />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Scrollable vertical Saved Items list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        <View className="gap-6 mt-2">
          {SAVED_ITEMS.map((item) => (
            <View key={item.id} className="relative w-full h-[220px] rounded-[24px] overflow-hidden bg-peach-light/40">
              {/* Cover Image */}
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-full"
                contentFit="cover"
                transition={200}
              />
              
              {/* Floating Bottom Card */}
              <View className="absolute bottom-4 left-4 right-4 bg-white/95 px-5 py-4 rounded-[18px] flex-row justify-between items-center shadow-md shadow-brand-navy/5">
                <View className="flex-1 pr-4">
                  <Text className="text-[17px] font-bold text-brand-navy mb-1" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location-sharp" size={14} color="#FF7E4A" />
                    <Text className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                      {item.location}
                    </Text>
                  </View>
                </View>
                
                <Pressable className="w-8 h-8 rounded-full bg-peach-light/30 items-center justify-center active:bg-peach-light/50">
                  <Feather name="chevron-right" size={18} color="#FF7E4A" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
