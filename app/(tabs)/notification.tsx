import { SkeletonBlock } from "@/components/ui/skeleton";
import { MOCK_NOTIFICATIONS } from "@/constants/mockData";
import "@/global.css";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const { width: screenWidth } = useWindowDimensions();
  const isLoading = useSimulatedLoading();

  const iconSize = Math.min(Math.max(screenWidth * 0.12, 44), 52);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-50">
        <Pressable className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50">
          <Feather name="chevron-left" size={24} color="#2A3A4E" />
        </Pressable>
        <Text className="text-xl font-bold text-brand-navy">Notifications</Text>
        <Pressable
          onPress={markAllAsRead}
          className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 active:bg-gray-50"
        >
          <Ionicons name="checkmark-done" size={20} color="#2A3A4E" />
        </Pressable>
      </View>

      {/* Notifications List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        <View className="gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <View
                  key={`notification-skeleton-${index}`}
                  className="flex-row p-4 rounded-2xl border border-gray-100 items-start gap-4 bg-white"
                >
                  <SkeletonBlock
                    className="rounded-full"
                    style={{ width: iconSize, height: iconSize }}
                  />

                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-2">
                      <SkeletonBlock className="h-4 w-7/12 rounded-full" />
                      <SkeletonBlock className="w-2 h-2 rounded-full" />
                    </View>
                    <SkeletonBlock className="h-3 w-full rounded-full mb-2" />
                    <SkeletonBlock className="h-3 w-11/12 rounded-full mb-3" />
                    <SkeletonBlock className="h-2.5 w-24 rounded-full" />
                  </View>
                </View>
              ))
            : notifications.map((notif) => {
                let iconName: "calendar" | "percent" | "cloud-rain" =
                  "calendar";
                let iconColor = "#FF7E4A";
                let iconBg = "bg-peach-light/20";

                if (notif.type === "discount") {
                  iconName = "percent";
                  iconColor = "#4CAF50";
                  iconBg = "bg-green-50";
                } else if (notif.type === "alert") {
                  iconName = "cloud-rain";
                  iconColor = "#2196F3";
                  iconBg = "bg-blue-50";
                }

                return (
                  <Pressable
                    key={notif.id}
                    onPress={() => toggleRead(notif.id)}
                    className={`flex-row p-4 rounded-2xl border border-gray-100 items-start gap-4 active:bg-gray-50 ${
                      notif.unread
                        ? "bg-peach-light/5 border-peach-light/30"
                        : "bg-white"
                    }`}
                  >
                    {/* Custom Icon Circle */}
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center ${iconBg}`}
                    >
                      <Feather name={iconName} size={20} color={iconColor} />
                    </View>

                    {/* Content details */}
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text
                          className={`text-[15px] font-bold text-brand-navy ${notif.unread ? "pr-2" : ""}`}
                        >
                          {notif.title}
                        </Text>
                        {notif.unread && (
                          <View className="w-2 h-2 rounded-full bg-brand-orange" />
                        )}
                      </View>
                      <Text className="text-sm text-gray-sub leading-5 mb-2">
                        {notif.description}
                      </Text>
                      <Text className="text-xs font-medium text-gray-sub/70">
                        {notif.time}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
