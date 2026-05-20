import { Destination } from "@/constants/mockData";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface SwipeableSavedCardProps {
  item: Destination;
  onPress: () => void;
  onDelete: () => void;
}

export default function SwipeableSavedCard({
  item,
  onPress,
  onDelete,
}: SwipeableSavedCardProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const cardHeight = Math.min(Math.max(SCREEN_WIDTH * 0.58, 210), 260);

  // Dimensions and animation values
  const height = useSharedValue(cardHeight);
  const marginBottom = useSharedValue(24);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    height.value = cardHeight;
  }, [cardHeight, height]);

  const SWIPE_THRESHOLD = -90; // Reveal delete panel at -90px
  const AUTO_DELETE_THRESHOLD = -240; // Dragging past this triggers automatic collapse deletion

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // prevent catching vertical scroll gestures
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      const newX = event.translationX;
      if (newX < 0) {
        // Dragging left (negative value)
        translateX.value = newX;
      } else {
        // Swipe right resistance
        translateX.value = newX * 0.1;
      }
    })
    .onEnd((event) => {
      if (translateX.value < AUTO_DELETE_THRESHOLD) {
        runOnJS(triggerDelete)();
      } else if (translateX.value < SWIPE_THRESHOLD * 0.7) {
        // Reveal swipe panel
        translateX.value = withSpring(SWIPE_THRESHOLD, {
          damping: 18,
          stiffness: 120,
        });
      } else {
        // Snap back to initial position
        translateX.value = withSpring(0, { damping: 18, stiffness: 120 });
      }
    });

  const triggerDelete = () => {
    // Fire haptic success vibration
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Slide completely off-screen
    translateX.value = withTiming(
      -SCREEN_WIDTH - 50,
      { duration: 250 },
      (isFinished) => {
        if (isFinished) {
          // Fade out and collapse height and margin to 0
          opacity.value = withTiming(0, { duration: 150 });
          marginBottom.value = withTiming(0, { duration: 200 });
          height.value = withTiming(0, { duration: 250 }, (finished) => {
            if (finished) {
              runOnJS(onDelete)();
            }
          });
        }
      },
    );
  };

  const handleCardPress = () => {
    // If the card is swiped open, any tap on the card should close it first rather than navigating
    if (translateX.value < -10) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      translateX.value = withSpring(0, { damping: 18, stiffness: 120 });
    } else {
      onPress();
    }
  };

  // Outer container collapses in height/margin/opacity upon deletion
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      marginBottom: marginBottom.value,
      opacity: opacity.value,
    };
  });

  // Inner card slides horizontally on swipe
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Swipe delete panel (background) transitions in response to drag
  const animatedDeletePanelStyle = useAnimatedStyle(() => {
    // Slowly fade/scale trash icon as you pull it
    const scale =
      translateX.value < SWIPE_THRESHOLD
        ? 1 + (SWIPE_THRESHOLD - translateX.value) * 0.002
        : 1;

    return {
      opacity:
        translateX.value < -20
          ? withTiming(1, { duration: 100 })
          : withTiming(0, { duration: 100 }),
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[animatedContainerStyle]}
      className="relative w-full overflow-hidden rounded-[24px]"
    >
      {/* 1. Underlying Delete Action Panel */}
      <Animated.View
        style={[animatedDeletePanelStyle]}
        className="absolute inset-0 bg-rose-500 rounded-[24px] flex-row justify-end items-center"
      >
        <Pressable
          onPress={triggerDelete}
          className="w-[90px] h-full items-center justify-center bg-rose-600 rounded-[24px] active:bg-rose-700"
        >
          <View className="items-center gap-1.5">
            <View className="w-11 h-11 rounded-full bg-white/10 items-center justify-center border border-white/5 shadow-sm shadow-black/5">
              <Feather name="trash-2" size={20} color="#FFFFFF" />
            </View>
            <Text className="text-[11px] font-bold text-white tracking-widest uppercase">
              Delete
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* 2. Overlaid Swipeable Card (Pan Gesture Target) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[animatedCardStyle, { height: "100%", width: "100%" }]}
        >
          <Pressable
            onPress={handleCardPress}
            className="w-full h-full rounded-[24px] overflow-hidden bg-peach-light/40 relative active:opacity-98"
          >
            {/* Cover Image */}
            <AnimatedImage
              source={{ uri: item.imageUrl }}
              style={StyleSheet.absoluteFillObject}
              className="w-full h-full"
              contentFit="cover"
              transition={200}
            />

            {/* Overlay Visual Gradient (Bottom focused dark overlay) */}
            <View className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />

            {/* Elevated Bottom Details Card Overlay */}
            <View className="absolute bottom-4 left-4 right-4 bg-white/95 px-5 py-4 rounded-[18px] flex-row justify-between items-center shadow-md shadow-brand-navy/5">
              <View className="flex-1 pr-4">
                <Text
                  className="text-[17px] font-bold text-brand-navy mb-1"
                  numberOfLines={1}
                >
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
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
