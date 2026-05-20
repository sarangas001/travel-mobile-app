import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface CategoryBubbleProps {
  id: 'hiking' | 'kayaking' | 'camping' | 'surfing';
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CategoryBubble({ id, label, isSelected, onPress }: CategoryBubbleProps) {
  // Shared values for animation state
  const activeProgress = useSharedValue(isSelected ? 1 : 0);
  const scale = useSharedValue(1);

  // Sync animation progress when active state changes
  useEffect(() => {
    activeProgress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected]);

  // Animated styles for the bubble container
  const bubbleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      activeProgress.value,
      [0, 1],
      ['#FFFFFF', '#FF7E4A'] // brand-orange is #FF7E4A, white is #FFFFFF
    );

    const borderColor = interpolateColor(
      activeProgress.value,
      [0, 1],
      ['#F3F4F6', '#FF7E4A'] // border-gray-100 is #F3F4F6
    );

    return {
      backgroundColor,
      borderColor,
      borderWidth: 1,
      transform: [{ scale: scale.value }],
      shadowOpacity: withTiming(isSelected ? 0.25 : 0, { duration: 200 }),
      shadowColor: '#FF7E4A',
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 10,
      elevation: isSelected ? 4 : 0,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(isSelected ? 1.08 : 1.0, { damping: 10, stiffness: 100 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Keep track of scale transitions
  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.08 : 1.0, { damping: 10, stiffness: 100 });
  }, [isSelected]);

  // Render correct icon based on category type
  const renderIcon = () => {
    const iconColor = isSelected ? '#FFFFFF' : '#8D9CAE';
    const iconSize = 22;

    switch (id) {
      case 'hiking':
        return <FontAwesome6 name="person-hiking" size={24} color={iconColor} />;
      case 'kayaking':
        return <Ionicons name="boat-outline" size={24} color={iconColor} />;
      case 'camping':
        return <FontAwesome6 name="campground" size={20} color={iconColor} />;
      case 'surfing':
        return <FontAwesome6 name="water" size={20} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="items-center"
    >
      <Animated.View
        style={bubbleStyle}
        className="w-[68px] h-[68px] rounded-full items-center justify-center"
      >
        {renderIcon()}
      </Animated.View>
      <Text 
        className={`text-[11px] font-bold mt-2.5 tracking-wider transition-colors duration-200 ${
          isSelected ? 'text-brand-orange' : 'text-gray-sub'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
