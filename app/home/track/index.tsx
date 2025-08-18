import Header from "@/components/shared/Header";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { getTrackCategoriesWithItemsAndProgress } from "@/services/core/TrackService";
import { ROUTES } from "@/utils/route";
import { useRouter } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackScreen() {
  const { patient } = useContext(PatientContext);
  const { categories, setCategories } = useContext(TrackContext);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [formattedDate, setFormattedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const router = useRouter();

  useEffect(() => {
    if (!patient) {
      router.replace(ROUTES.MY_HEALTH);
      return;
    }
    const loadTrackItemsForSelectedDate = async () => {
      const newFormattedDate = selectedDate.format("MM-DD-YYYY");
      setFormattedDate(newFormattedDate);
      const res = await getTrackCategoriesWithItemsAndProgress(
        patient.id,
        newFormattedDate
      );
      setCategories(res);
    };

    loadTrackItemsForSelectedDate();
  }, [selectedDate]);

  const handleAddItem = () => {
    router.push({
      pathname: "/home/track/addItem",
      params: { date: formattedDate },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* header */}
      <Header title="Track" />
      <TouchableOpacity onPress={handleAddItem}>
        <View className="bg-white px-3 py-1.5 rounded-lg">
          <Text>Add Item</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
