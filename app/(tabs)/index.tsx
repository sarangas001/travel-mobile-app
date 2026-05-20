import CategoryBubble from "@/components/CategoryBubble";
import { MOCK_CATEGORIES, MOCK_DESTINATIONS } from "@/constants/mockData";
import "@/global.css";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SkeletonBlock } from "@/components/ui/skeleton";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { listDestinations } from "@/services/travel-data";
import type { Destination } from "@/constants/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const simulatedLoading = useSimulatedLoading();
  const [selectedCategory, setSelectedCategory] = useState<
    "hiking" | "kayaking" | "camping" | "surfing"
  >("hiking");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const popularCardWidth = Math.min(Math.max(screenWidth * 0.72, 240), 320);
  const recommendationImageSize = Math.min(
    Math.max(screenWidth * 0.23, 72),
    88,
  );

  useEffect(() => {
    let isMounted = true;

    const loadDestinations = async () => {
      try {
        setIsFetching(true);
        setLoadError(null);

        const response = await listDestinations({ limit: 50 });

        if (!isMounted) {
          return;
        }

        setDestinations(response.destinations);
      } catch {
        if (!isMounted) {
          return;
        }

        setDestinations(MOCK_DESTINATIONS);
        setLoadError("Live backend unavailable, showing local fallback data.");
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    loadDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  const isLoading = simulatedLoading || isFetching;

  // Search filter
  const searchedDestinations = destinations.filter((dest) => {
    const matchStr =
      `${dest.title} ${dest.locationName} ${dest.country}`.toLowerCase();
    return matchStr.includes(searchQuery.toLowerCase());
  });

  // Filter popular by selected category and search query
  const popularDestinations = searchedDestinations.filter(
    (dest) => dest.category === selectedCategory,
  );

  // Filter recommendations (recommended flag + search query matches)
  const recommendedDestinations = searchedDestinations.filter(
    (dest) => dest.isRecommended,
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        {/* Destinations Dropdown */}
        <Pressable className="flex-row items-center gap-1.5 active:opacity-75">
          <Text className="text-2xl font-bold text-brand-navy">
            Destinations
          </Text>
          <View className="flex-col leading-none items-center justify-center h-5 w-4">
            <Feather
              name="chevron-up"
              size={10}
              color="#2A3A4E"
              className="h-2"
            />
            <Feather
              name="chevron-down"
              size={10}
              color="#2A3A4E"
              className="h-2"
            />
          </View>
        </Pressable>

        {/* Filter Toggle with Badge */}
        <Pressable className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50 relative">
          <Ionicons
            name="filter-outline"
            size={22}
            color="#2A3A4E"
            style={{ transform: [{ scaleX: -1 }] }}
          />
          {/* Badge Dot */}
          <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand-orange border-2 border-white" />
        </Pressable>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {loadError ? (
          <View className="mx-6 mt-2 mb-1 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Text className="text-sm font-semibold text-amber-900">
              {loadError}
            </Text>
          </View>
        ) : null}

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
            <Text className="text-[17px] font-bold text-brand-navy">
              What Are You Looking For
            </Text>
            <Pressable className="active:opacity-70">
              <Text className="text-sm font-bold text-gray-sub/70">
                Show All
              </Text>
            </Pressable>
          </View>

          {/* Categories Horizontal Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
          >
            {isLoading
              ? MOCK_CATEGORIES.map((cat) => (
                  <View key={cat.id} className="items-center">
                    <SkeletonBlock className="w-[68px] h-[68px] rounded-full" />
                    <SkeletonBlock className="w-14 h-3 rounded-full mt-2.5" />
                  </View>
                ))
              : MOCK_CATEGORIES.map((cat) => (
                  <CategoryBubble
                    key={cat.id}
                    id={cat.id}
                    label={cat.label}
                    isSelected={selectedCategory === cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                  />
                ))}
          </ScrollView>
        </View>

        {/* Popular Destinations */}
        <View className="mt-8">
          <Text className="text-[17px] font-bold text-brand-navy px-6 mb-4">
            Popular Destinations
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}
            snapToInterval={280 + 20}
            decelerationRate="fast"
          >
            {isLoading ? (
              Array.from({
                length: Math.min(3, Math.max(2, Math.round(screenWidth / 160))),
              }).map((_, index) => (
                <View
                  key={`popular-skeleton-${index}`}
                  style={{ width: popularCardWidth, height: 360 }}
                  className="rounded-[32px] overflow-hidden bg-white border border-gray-50"
                >
                  <SkeletonBlock className="absolute inset-0 rounded-[32px]" />
                  <View className="absolute inset-0 justify-end p-5">
                    <SkeletonBlock className="h-5 w-3/4 rounded-full mb-2" />
                    <SkeletonBlock className="h-3 w-1/2 rounded-full" />
                  </View>
                </View>
              ))
            ) : popularDestinations.length === 0 ? (
              <View className="w-[280px] h-[360px] rounded-[32px] border border-dashed border-gray-200 items-center justify-center p-6 bg-gray-50/50">
                <Feather
                  name="map-pin"
                  size={32}
                  color="#8D9CAE"
                  className="opacity-60 mb-2"
                />
                <Text className="text-sm font-bold text-gray-sub text-center">
                  No popular places found
                </Text>
              </View>
            ) : (
              popularDestinations.map((dest) => (
                <Pressable
                  key={dest.id}
                  onPress={() =>
                    router.push({
                      pathname: "/destination/[id]",
                      params: { id: dest.id },
                    })
                  }
                  style={{ width: popularCardWidth, height: 360 }}
                  className="rounded-[32px] overflow-hidden bg-peach-light/40 relative active:opacity-95"
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
                        {dest.locationName}, {dest.country}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

        {/* Recommendation Feed */}
        <View className="mt-8 px-6">
          <Text className="text-[17px] font-bold text-brand-navy mb-4">
            Recommendation
          </Text>
          <View className="gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <View
                  key={`recommendation-skeleton-${index}`}
                  className="flex-row p-3 rounded-3xl border border-gray-50 bg-white items-center gap-4"
                >
                  <SkeletonBlock
                    className="rounded-[20px]"
                    style={{
                      width: recommendationImageSize,
                      height: recommendationImageSize,
                    }}
                  />

                  <View className="flex-1">
                    <SkeletonBlock className="h-2.5 w-16 rounded-full mb-2" />
                    <SkeletonBlock className="h-4 w-10/12 rounded-full mb-3" />
                    <View className="flex-row items-center gap-1">
                      <SkeletonBlock className="h-3 w-14 rounded-full" />
                      <SkeletonBlock className="h-2.5 w-24 rounded-full" />
                    </View>
                  </View>
                </View>
              ))
            ) : recommendedDestinations.length === 0 ? (
              <View className="p-8 rounded-3xl border border-dashed border-gray-200 items-center justify-center bg-gray-50/50">
                <Feather
                  name="alert-circle"
                  size={28}
                  color="#8D9CAE"
                  className="opacity-60 mb-2"
                />
                <Text className="text-sm font-bold text-gray-sub text-center">
                  No recommendations match your search
                </Text>
              </View>
            ) : (
              recommendedDestinations.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    router.push({
                      pathname: "/destination/[id]",
                      params: { id: item.id },
                    })
                  }
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
                      <Ionicons
                        name="location-sharp"
                        size={12}
                        color="#FF7E4A"
                      />
                      <Text className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                        {item.country}
                      </Text>
                    </View>
                    <Text
                      className="text-base font-bold text-brand-navy mb-1.5"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      {/* Stars */}
                      <View className="flex-row gap-0.5 mr-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Ionicons
                            key={s}
                            name="star"
                            size={12}
                            color="#FF7E4A"
                          />
                        ))}
                      </View>
                      <Text className="text-[10px] font-bold text-gray-sub/70">
                        {item.rating.toFixed(1)} OUT OF 5
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
