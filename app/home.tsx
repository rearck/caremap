import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const Home = () => {
  const router = useRouter();
  return (
    <View className="h-screen flex flex-col items-center justify-center bg-[#DCFBFF]">
      <Text
        size="xl"
        bold
        className="self-center absolute top-4 text-[#058295]"
      >
        Home Page
      </Text>
      <TouchableOpacity
        onPress={() => {
          router.replace("/launch");
        }}
      >
        <Text
          size="lg"
          className="text-white bg-[#49AFBE] self-center p-2 px-[20] rounded-sm"
        >
          Go to Launch Page
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
