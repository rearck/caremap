import { View, Text } from "react-native";

function insight() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text style={{ color: palette.primary }} className="text-2xl font-bold ">
        Insight
      </Text>
      <Text className="text-lg text-gray-500 mt-2">Coming soon...</Text>
    </View>
  );
}

export default insight;

import React from "react";
import palette from "@/utils/theme/color";
