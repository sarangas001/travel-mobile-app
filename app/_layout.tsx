import "@/global.css"
import { Stack } from "expo-router";
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>
    </Stack>
  );
}