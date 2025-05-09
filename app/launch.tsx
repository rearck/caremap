import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const Launch = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-[#DCFBFF]">
      <TouchableOpacity
        onPress={() => {
          router.replace("/home");
        }}
      >
        <Text
          size="lg"
          className="text-white bg-[#49AFBE] p-2 px-[20] rounded-sm"
        >
          Go to Home Page
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Launch;
