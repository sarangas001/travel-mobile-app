import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import '@/global.css';
import { MOCK_DESTINATIONS } from '@/constants/mockData';

const CATEGORIES = ['Places', 'Hotels', 'Destinations', 'Tours'];

export default function SavedPlacesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Destinations');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic saved places initialized with IDs dest_5, dest_6, and dest_7
  const [savedIds, setSavedIds] = useState<string[]>(['dest_5', 'dest_6', 'dest_7']);

  const savedItems = MOCK_DESTINATIONS.filter((item) => savedIds.includes(item.id));

  // Search filter
  const filteredSavedItems = savedItems.filter((item) => {
    const matchStr = `${item.title} ${item.locationName} ${item.country}`.toLowerCase();
    return matchStr.includes(searchQuery.toLowerCase());
  });

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
          {filteredSavedItems.length === 0 ? (
            <View className="py-20 px-6 items-center justify-center">
              <View className="w-20 h-20 rounded-full bg-peach-light/20 items-center justify-center mb-4">
                <Ionicons name="heart-dislike-outline" size={36} color="#FF7E4A" />
              </View>
              <Text className="text-lg font-bold text-brand-navy mb-2">No saved items found</Text>
              <Text className="text-sm text-gray-sub text-center leading-5 px-6">
                Explore popular destinations and tap the bookmark to save them to your wishlist.
              </Text>
            </View>
          ) : (
            filteredSavedItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: '/destination/[id]',
                    params: { id: item.id },
                  })
                }
                className="relative w-full h-[220px] rounded-[24px] overflow-hidden bg-peach-light/40 active:opacity-95"
              >
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
                        {item.locationName}, {item.country}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="w-8 h-8 rounded-full bg-peach-light/30 items-center justify-center">
                    <Feather name="chevron-right" size={18} color="#FF7E4A" />
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
