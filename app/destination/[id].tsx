import { MOCK_DESTINATIONS } from "@/constants/mockData";
import "@/global.css";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getDestination,
  listDestinationReviews,
} from "@/services/travel-data";
import type { Destination, Review } from "@/constants/mockData";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function DestinationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Find matching destination or fallback gracefully to prevent crashes
  const [destination, setDestination] = useState<Destination>(MOCK_DESTINATIONS[0]);
  const [reviews, setReviews] = useState<Review[]>(MOCK_DESTINATIONS[0].reviews);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDestination = async () => {
      if (!id || Array.isArray(id)) {
        return;
      }

      try {
        setLoadError(null);

        const [detail, reviewList] = await Promise.all([
          getDestination(id),
          listDestinationReviews(id),
        ]);

        if (!isMounted) {
          return;
        }

        setDestination({
          ...detail,
          reviews: reviewList.length ? reviewList : detail.reviews,
        });
        setReviews(reviewList.length ? reviewList : detail.reviews);
      } catch {
        if (!isMounted) {
          return;
        }

        setLoadError("Live destination data unavailable, showing fallback details.");

        const fallback = MOCK_DESTINATIONS.find((d) => d.id === id) || MOCK_DESTINATIONS[0];
        setDestination(fallback);
        setReviews(fallback.reviews);
      } finally {
        // no-op; the screen uses the hydrated destination model or fallback content
      }
    };

    loadDestination();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Component states
  const [activeTab, setActiveTab] = useState<"Overview" | "Promo" | "Review">(
    "Overview",
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedDateId, setSelectedDateId] = useState<string>("cal_1");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [isReadMore, setIsReadMore] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Selected date details
  const selectedDate = destination.availabilityCalendar.find(
    (c) => c.id === selectedDateId,
  );

  const toggleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsBookmarked(!isBookmarked);
  };

  const handleBookNow = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccessModal(true);
  };

  const handleSelectDate = (dateId: string, isAvailable: boolean) => {
    if (!isAvailable) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDateId(dateId);
  };

  const adjustGuests = (type: "adults" | "children", action: "inc" | "dec") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === "adults") {
      if (action === "inc") setAdults((prev) => Math.min(prev + 1, 10));
      if (action === "dec") setAdults((prev) => Math.max(prev - 1, 1));
    } else {
      if (action === "inc") setChildren((prev) => Math.min(prev + 1, 5));
      if (action === "dec") setChildren((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Scroll view of the page */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 bg-bg-gray"
      >
        {/* Cover Photo Header */}
        <View
          style={{ height: SCREEN_HEIGHT * 0.46 }}
          className="w-full relative overflow-hidden bg-peach-light/45"
        >
          <AnimatedImage
            source={{ uri: destination.imageUrl }}
            style={StyleSheet.absoluteFillObject}
            className="w-full h-full"
            contentFit="cover"
            transition={300}
          />

          {/* Top Control Bar Overlays */}
          <SafeAreaView
            edges={["top"]}
            className="absolute inset-x-0 top-0 flex-row justify-between items-center px-6 py-2"
          >
            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/20 border border-white/10 items-center justify-center active:bg-white/40"
            >
              <Feather name="chevron-left" size={24} color="#FFF" />
            </Pressable>

            {/* Bookmark ribbon */}
            <Pressable
              onPress={toggleBookmark}
              className="w-10 h-10 rounded-full bg-white/20 border border-white/10 items-center justify-center active:bg-white/40"
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isBookmarked ? "#FF7E4A" : "#FFF"}
              />
            </Pressable>
          </SafeAreaView>

          {/* Bottom aligned card details inside the cover view */}
          <View className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/35 to-transparent p-6 justify-end pt-24">
            {/* Star ratings */}
            <View className="flex-row items-center gap-1.5 mb-1.5 bg-white/15 self-start px-3 py-1.5 rounded-full border border-white/10">
              <View className="flex-row gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star" size={12} color="#FF7E4A" />
                ))}
              </View>
              <Text className="text-[10px] font-bold text-white tracking-wide uppercase">
                {destination.rating.toFixed(1)} OUT OF 5
              </Text>
            </View>

            {/* Title */}
            <Text className="text-[28px] font-bold text-white mb-2 leading-8">
              {destination.title}
            </Text>

            {/* Subtitle location */}
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="location-sharp" size={14} color="#FF7E4A" />
              <Text className="text-sm font-semibold text-white/90">
                {destination.locationName}, {destination.country}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Overlap Sheet */}
        <View className="bg-white rounded-t-[36px] -mt-6 px-6 pt-8 pb-4">
          {/* Overlapping Sheet Tabs */}
          <View className="flex-row gap-8 border-b border-gray-100 pb-3 mb-5">
            {(["Overview", "Promo & Discount", "Review"] as const).map(
              (tab) => {
                const tabId = tab.startsWith("Overview")
                  ? "Overview"
                  : tab.startsWith("Promo")
                    ? "Promo"
                    : "Review";
                const isActive = activeTab === tabId;
                return (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tabId)}
                    className="items-center"
                  >
                    <Text
                      className={`text-base font-bold transition-colors ${isActive ? "text-brand-navy" : "text-gray-sub"}`}
                    >
                      {tab}
                    </Text>
                    {isActive && (
                      <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5" />
                    )}
                  </Pressable>
                );
              },
            )}
          </View>

          {/* Description Block */}
          {activeTab === "Overview" && (
            <View className="mb-6">
              <Text className="text-sm text-gray-sub leading-6 text-justify">
                {isReadMore
                  ? destination.description
                  : `${destination.description.slice(0, 160)}...`}
                <Text
                  onPress={() => setIsReadMore(!isReadMore)}
                  className="text-brand-orange font-bold text-sm"
                >
                  {isReadMore ? " read less" : " read more"}
                </Text>
              </Text>
            </View>
          )}

          {activeTab === "Promo" && (
            <View className="mb-6 p-4 bg-green-50/50 rounded-2xl border border-green-100 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                <Feather name="percent" size={18} color="#4CAF50" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-brand-navy">
                  20% Summer Early Bird Discount
                </Text>
                <Text className="text-xs text-gray-sub">
                  Applies automatically for reservations this week.
                </Text>
              </View>
            </View>
          )}

          {activeTab === "Review" && (
            <View className="mb-6 gap-4">
              {reviews.map((rev) => (
                <View
                  key={rev.id}
                  className="p-4 bg-bg-gray rounded-2xl border border-gray-50"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center gap-2.5">
                      <Image
                        source={{ uri: rev.userAvatar }}
                        style={{ width: 32, height: 32 }}
                        className="w-8 h-8 rounded-full bg-peach-light/40"
                      />
                      <Text className="text-sm font-bold text-brand-navy">
                        {rev.userName}
                      </Text>
                    </View>
                    <Text className="text-[10px] text-gray-sub/70 font-semibold">
                      {rev.date}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-sub leading-4">
                    {rev.comment}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Availability schedule */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-[16px] font-bold text-brand-navy">
                Availability
              </Text>
              <View className="flex-row items-center gap-1 bg-peach-light/20 px-2.5 py-1 rounded-md">
                <Feather name="calendar" size={12} color="#FF7E4A" />
                <Text className="text-[10px] font-bold text-brand-orange uppercase tracking-wide">
                  {destination.availabilityHours}
                </Text>
              </View>
            </View>

            {/* Date capsules slider */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {destination.availabilityCalendar.map((date) => {
                const isSelected = selectedDateId === date.id;
                return (
                  <Pressable
                    key={date.id}
                    onPress={() => handleSelectDate(date.id, date.isAvailable)}
                    className={`w-[58px] h-[72px] rounded-2xl items-center justify-center border transition-all ${
                      !date.isAvailable
                        ? "bg-gray-50 border-gray-100 opacity-40"
                        : isSelected
                          ? "bg-brand-navy border-brand-navy shadow-sm"
                          : "bg-white border-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${isSelected ? "text-white/60" : "text-gray-sub"}`}
                    >
                      {date.dayName}
                    </Text>
                    <Text
                      className={`text-lg font-bold mt-1.5 ${isSelected ? "text-white" : "text-brand-navy"}`}
                    >
                      {date.dateNumber}
                    </Text>
                    {isSelected && date.isAvailable && (
                      <View className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 absolute bottom-1.5" />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Guests stepper panels */}
          <View className="mb-4">
            <Text className="text-[16px] font-bold text-brand-navy mb-3">
              Select Guests
            </Text>

            <View className="flex-row gap-4">
              {/* Adults Selector */}
              <View className="flex-1 bg-bg-gray border border-gray-100/30 p-4 rounded-3xl items-center flex-row justify-between">
                <View>
                  <Text className="text-sm font-bold text-brand-navy mb-0.5">
                    Adult
                  </Text>
                  <Text className="text-[10px] text-gray-sub/80 font-semibold">
                    Age 13 or above
                  </Text>
                </View>
                <View className="flex-row items-center bg-white rounded-full px-2 py-1.5 gap-2 border border-gray-100">
                  <Pressable
                    onPress={() => adjustGuests("adults", "dec")}
                    className="w-6 h-6 rounded-full bg-peach-light/20 items-center justify-center active:bg-peach-light/45"
                  >
                    <Feather name="minus" size={12} color="#FF7E4A" />
                  </Pressable>
                  <Text className="text-sm font-bold text-brand-navy w-4 text-center">
                    {adults}
                  </Text>
                  <Pressable
                    onPress={() => adjustGuests("adults", "inc")}
                    className="w-6 h-6 rounded-full bg-peach-light/20 items-center justify-center active:bg-peach-light/45"
                  >
                    <Feather name="plus" size={12} color="#FF7E4A" />
                  </Pressable>
                </View>
              </View>

              {/* Children Selector */}
              <View className="flex-1 bg-bg-gray border border-gray-100/30 p-4 rounded-3xl items-center flex-row justify-between">
                <View>
                  <Text className="text-sm font-bold text-brand-navy mb-0.5">
                    Children
                  </Text>
                  <Text className="text-[10px] text-gray-sub/80 font-semibold">
                    Under 2 years old
                  </Text>
                </View>
                <View className="flex-row items-center bg-white rounded-full px-2 py-1.5 gap-2 border border-gray-100">
                  <Pressable
                    onPress={() => adjustGuests("children", "dec")}
                    className="w-6 h-6 rounded-full bg-peach-light/20 items-center justify-center active:bg-peach-light/45"
                  >
                    <Feather name="minus" size={12} color="#FF7E4A" />
                  </Pressable>
                  <Text className="text-sm font-bold text-brand-navy w-4 text-center">
                    {children}
                  </Text>
                  <Pressable
                    onPress={() => adjustGuests("children", "inc")}
                    className="w-6 h-6 rounded-full bg-peach-light/20 items-center justify-center active:bg-peach-light/45"
                  >
                    <Feather name="plus" size={12} color="#FF7E4A" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {loadError ? (
        <View className="absolute top-16 left-6 right-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
          <Text className="text-sm font-semibold text-amber-900">
            {loadError}
          </Text>
        </View>
      ) : null}

      {/* Floating Bottom Booking Summary and Action CTA */}
      <View className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100/70 p-6 flex-row justify-between items-center shadow-lg shadow-brand-navy/10">
        <View>
          <Text className="text-xs font-semibold text-gray-sub/80 mb-0.5">
            Total Price
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-2xl font-bold text-brand-orange">
              ${destination.pricePerPerson * (adults + children)}
            </Text>
            <Text className="text-xs font-semibold text-gray-sub">
              {" "}
              / person
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleBookNow}
          className="bg-brand-orange px-8 py-4 rounded-2xl shadow-md shadow-brand-orange/20 active:opacity-90 active:scale-98"
        >
          <Text className="text-white text-base font-bold tracking-wide">
            Book Now
          </Text>
        </Pressable>
      </View>

      {/* Booking Confirmation Celebration Modal Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 bg-brand-navy/55 justify-end">
          <View className="bg-white rounded-t-[40px] px-8 py-10 items-center shadow-2xl">
            {/* Decorative Notch */}
            <View className="w-12 h-1.5 rounded-full bg-gray-100 mb-6" />

            {/* Success Icon Circle */}
            <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center border-4 border-green-100 mb-5">
              <Ionicons name="checkmark-circle" size={44} color="#4CAF50" />
            </View>

            <Text className="text-2xl font-bold text-brand-navy mb-2">
              Booking Confirmed!
            </Text>
            <Text className="text-sm text-gray-sub text-center leading-5 mb-8 px-4">
              Your reservation at{" "}
              <Text className="font-bold text-brand-navy">
                {destination.title}
              </Text>{" "}
              has been successfully placed. We&apos;ve sent details to your
              alerts context.
            </Text>

            {/* Info Cards Summary */}
            <View className="w-full bg-bg-gray border border-gray-100 p-5 rounded-3xl gap-3.5 mb-8">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-semibold text-gray-sub">
                  Date Scheduled
                </Text>
                <Text className="text-sm font-bold text-brand-navy">
                  {selectedDate
                    ? `${selectedDate.dayName} ${selectedDate.dateNumber}, May 2026`
                    : "Default Slot"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
                <Text className="text-xs font-semibold text-gray-sub">
                  Guests Registered
                </Text>
                <Text className="text-sm font-bold text-brand-navy">
                  {adults} Adults, {children} Children
                </Text>
              </View>
              <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
                <Text className="text-xs font-semibold text-gray-sub">
                  Total Amount Paid
                </Text>
                <Text className="text-base font-bold text-brand-orange">
                  ${destination.pricePerPerson * (adults + children)}
                </Text>
              </View>
            </View>

            {/* CTAs */}
            <View className="flex-row gap-4 w-full">
              <Pressable
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push("/(tabs)/notification");
                }}
                className="flex-1 border border-brand-orange py-4 rounded-2xl items-center justify-center active:bg-peach-light/10"
              >
                <Text className="text-brand-orange font-bold text-base">
                  View Notifications
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowSuccessModal(false);
                  router.back();
                }}
                className="flex-1 bg-brand-orange py-4 rounded-2xl items-center justify-center shadow-md shadow-brand-orange/20 active:opacity-95"
              >
                <Text className="text-white font-bold text-base">
                  Explore More
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
