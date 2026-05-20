import React, { useEffect } from "react";
import { View, type ViewProps } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

interface SkeletonBlockProps extends ViewProps {
  className?: string;
}

export function SkeletonBlock({
  className,
  style,
  ...rest
}: SkeletonBlockProps) {
  const pulse = useSharedValue(0.35);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <AnimatedView
      className={`bg-gray-100 ${className ?? ""}`}
      style={[animatedStyle, style]}
      {...rest}
    />
  );
}
