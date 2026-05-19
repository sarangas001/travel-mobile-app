import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.brandNavy,
        tabBarInactiveTintColor: COLORS.graySub,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 75,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // Premium shadow effect
          shadowColor: '#2A3A4E',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.06,
          shadowRadius: 20,
          elevation: 15,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Feather name="home" size={24} color={color} />
              {focused && (
                <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Feather name="map" size={23} color={color} />
              {focused && (
                <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Feather name="bell" size={24} color={color} />
              {focused && (
                <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Feather name="user" size={24} color={color} />
              {focused && (
                <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}