import { View, Text } from "react-native";
function careTeam() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text style={{ color: palette.primary }} className="text-2xl font-bold ">
        careTeam
      </Text>
      <Text className="text-lg text-gray-500 mt-2">Coming soon...</Text>
    </View>
  );
}

export default careTeam;

import React from "react";
import palette from "@/utils/theme/color";
