import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import '@/global.css';

const PROFILE_OPTIONS = [
  { id: 'edit', label: 'Edit Profile', icon: 'person-outline', iconType: 'ionicons' },
  { id: 'address', label: 'Address', icon: 'location-outline', iconType: 'ionicons' },
  { id: 'wishlist', label: 'Wishlist', icon: 'heart-outline', iconType: 'ionicons' },
  { id: 'notification', label: 'Notification', icon: 'notifications-outline', iconType: 'ionicons' },
  { id: 'payment', label: 'Payment Setting', icon: 'card-outline', iconType: 'ionicons' },
];

export default function AccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Pressable className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50">
          <Feather name="chevron-left" size={24} color="#2A3A4E" />
        </Pressable>
        <Text className="text-xl font-bold text-brand-navy">Account</Text>
        <Pressable className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50">
          <Ionicons name="grid-outline" size={20} color="#2A3A4E" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        {/* Profile Card Center */}
        <View className="items-center mt-6 mb-8">
          {/* Avatar Container */}
          <View className="w-[150px] h-[150px] rounded-[36px] overflow-hidden bg-peach-light/40 border-[6px] border-peach-light/10 shadow-lg shadow-peach-medium/25 mb-4">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' }}
              className="w-full h-full"
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* User Profile Info */}
          <Text className="text-2xl font-bold text-brand-navy mb-1.5">Brandon Smith</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-sharp" size={14} color="#FF7E4A" />
            <Text className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              BALI, INDONESIA
            </Text>
          </View>
        </View>

        {/* Options List */}
        <View className="gap-4">
          {PROFILE_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              className="flex-row items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl active:bg-gray-50/70"
            >
              <View className="flex-row items-center gap-4">
                {/* Circular peach-light icon backdrop */}
                <View className="w-12 h-12 rounded-full bg-peach-light/35 items-center justify-center">
                  <Ionicons name={option.icon as any} size={22} color="#FF7E4A" />
                </View>
                <Text className="text-[16px] font-bold text-brand-navy">
                  {option.label}
                </Text>
              </View>

              <Feather name="chevron-right" size={20} color="#FF7E4A" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
