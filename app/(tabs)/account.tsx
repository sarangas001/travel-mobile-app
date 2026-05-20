import "@/global.css";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SkeletonBlock } from "@/components/ui/skeleton";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useProfileStore } from "@/store/use-profile-store";

const PROFILE_OPTIONS = [
  {
    id: "edit",
    label: "Edit Profile",
    icon: "person-outline",
    iconType: "ionicons",
  },
  {
    id: "address",
    label: "Address",
    icon: "location-outline",
    iconType: "ionicons",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: "heart-outline",
    iconType: "ionicons",
  },
  {
    id: "notification",
    label: "Notification",
    icon: "notifications-outline",
    iconType: "ionicons",
  },
  {
    id: "payment",
    label: "Payment Setting",
    icon: "card-outline",
    iconType: "ionicons",
  },
];

export default function AccountScreen() {
  const profile = useProfileStore((state) => state.profile);
  const isAvatarUploading = useProfileStore((state) => state.isAvatarUploading);
  const updateField = useProfileStore((state) => state.updateField);
  const simulateAvatarUpload = useProfileStore(
    (state) => state.simulateAvatarUpload,
  );
  const isLoading = useSimulatedLoading();

  const avatarChoices = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  ];

  const handleSimulateAvatarUpload = () => {
    const currentIndex = avatarChoices.indexOf(profile.avatarUrl);
    const nextAvatarUrl =
      avatarChoices[(currentIndex + 1) % avatarChoices.length];
    simulateAvatarUpload(nextAvatarUrl);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
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
        <View className="mt-6 mb-8">
          <View className="items-center">
            {isLoading ? (
              <>
                <SkeletonBlock className="w-[150px] h-[150px] rounded-[36px] mb-4" />
                <SkeletonBlock className="h-7 w-48 rounded-full mb-3" />
                <SkeletonBlock className="h-3 w-32 rounded-full" />
              </>
            ) : (
              <>
                <Pressable
                  onPress={handleSimulateAvatarUpload}
                  disabled={isAvatarUploading}
                  className="w-[150px] h-[150px] rounded-[36px] overflow-hidden bg-peach-light/40 border-[6px] border-peach-light/10 shadow-lg shadow-peach-medium/25 mb-4 active:opacity-95"
                >
                  <Image
                    source={{ uri: profile.avatarUrl }}
                    className="w-full h-full"
                    contentFit="cover"
                    transition={200}
                  />

                  <View className="absolute inset-x-0 bottom-0 bg-brand-navy/70 px-3 py-2 flex-row items-center justify-center gap-2">
                    {isAvatarUploading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Feather name="camera" size={14} color="#FFFFFF" />
                    )}
                    <Text className="text-[11px] font-bold text-white tracking-widest uppercase">
                      {isAvatarUploading ? "Uploading..." : "Change Avatar"}
                    </Text>
                  </View>
                </Pressable>

                <Text className="text-2xl font-bold text-brand-navy mb-1.5">
                  {profile.fullName}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="location-sharp" size={14} color="#FF7E4A" />
                  <Text className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                    {profile.location}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View className="mt-6 gap-4">
            <View className="bg-white border border-gray-50 rounded-2xl p-4">
              <Text className="text-[11px] font-bold text-gray-sub uppercase tracking-[0.2em] mb-3">
                Profile Fields
              </Text>

              {isLoading ? (
                <View className="gap-3">
                  <SkeletonBlock className="h-20 rounded-2xl" />
                  <SkeletonBlock className="h-20 rounded-2xl" />
                  <SkeletonBlock className="h-20 rounded-2xl" />
                  <SkeletonBlock className="h-20 rounded-2xl" />
                </View>
              ) : (
                <View className="gap-3">
                  <View className="bg-bg-gray/70 rounded-2xl px-4 py-3">
                    <Text className="text-[11px] font-bold text-gray-sub uppercase tracking-[0.18em] mb-2">
                      Full Name
                    </Text>
                    <TextInput
                      value={profile.fullName}
                      onChangeText={(value) => updateField("fullName", value)}
                      className="text-[16px] font-bold text-brand-navy py-0"
                      placeholder="Your name"
                      placeholderTextColor="#8D9CAE"
                    />
                  </View>

                  <View className="bg-bg-gray/70 rounded-2xl px-4 py-3">
                    <Text className="text-[11px] font-bold text-gray-sub uppercase tracking-[0.18em] mb-2">
                      Email Address
                    </Text>
                    <TextInput
                      value={profile.email}
                      onChangeText={(value) => updateField("email", value)}
                      className="text-[16px] font-bold text-brand-navy py-0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="you@example.com"
                      placeholderTextColor="#8D9CAE"
                    />
                  </View>

                  <View className="bg-bg-gray/70 rounded-2xl px-4 py-3">
                    <Text className="text-[11px] font-bold text-gray-sub uppercase tracking-[0.18em] mb-2">
                      Location
                    </Text>
                    <TextInput
                      value={profile.location}
                      onChangeText={(value) =>
                        updateField("location", value.toUpperCase())
                      }
                      className="text-[16px] font-bold text-brand-navy py-0 uppercase"
                      placeholder="Your location"
                      placeholderTextColor="#8D9CAE"
                    />
                  </View>

                  <View className="bg-bg-gray/70 rounded-2xl px-4 py-3 flex-row items-center justify-between">
                    <View>
                      <Text className="text-[11px] font-bold text-gray-sub uppercase tracking-[0.18em] mb-2">
                        Joined
                      </Text>
                      <Text className="text-[16px] font-bold text-brand-navy">
                        {profile.joinedAt}
                      </Text>
                    </View>
                    <View className="px-3 py-1.5 rounded-full bg-peach-light/20">
                      <Text className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                        Member
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View className="bg-white border border-gray-50 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[11px] font-bold text-gray-sub uppercase tracking-[0.2em]">
                  Saved Addresses
                </Text>
                <View className="px-3 py-1.5 rounded-full bg-brand-navy/5">
                  <Text className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">
                    {profile.addresses.length}
                  </Text>
                </View>
              </View>

              {isLoading ? (
                <View className="gap-3">
                  <SkeletonBlock className="h-20 rounded-2xl" />
                  <SkeletonBlock className="h-20 rounded-2xl" />
                </View>
              ) : (
                <View className="gap-3">
                  {profile.addresses.map((address) => (
                    <View
                      key={address.id}
                      className="bg-bg-gray/70 rounded-2xl px-4 py-3"
                    >
                      <View className="flex-row items-center justify-between mb-1.5">
                        <Text className="text-[15px] font-bold text-brand-navy">
                          {address.label}
                        </Text>
                        {address.isDefault && (
                          <View className="px-2.5 py-1 rounded-full bg-brand-orange/10">
                            <Text className="text-[9px] font-bold text-brand-orange uppercase tracking-widest">
                              Default
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-gray-sub leading-5">
                        {address.address}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Options List */}
        <View className="gap-4">
          {isLoading
            ? Array.from({ length: PROFILE_OPTIONS.length }).map((_, index) => (
                <View
                  key={`option-skeleton-${index}`}
                  className="flex-row items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl"
                >
                  <View className="flex-row items-center gap-4 flex-1 pr-4">
                    <SkeletonBlock className="w-12 h-12 rounded-full" />
                    <SkeletonBlock className="h-4 flex-1 rounded-full max-w-[180px]" />
                  </View>
                  <SkeletonBlock className="w-5 h-5 rounded-full" />
                </View>
              ))
            : PROFILE_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  className="flex-row items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl active:bg-gray-50/70"
                >
                  <View className="flex-row items-center gap-4">
                    {/* Circular peach-light icon backdrop */}
                    <View className="w-12 h-12 rounded-full bg-peach-light/35 items-center justify-center">
                      <Ionicons
                        name={option.icon as any}
                        size={22}
                        color="#FF7E4A"
                      />
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
