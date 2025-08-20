import Header from "@/components/shared/Header";
import TrackCalendar from "@/components/shared/track-shared-components/TrackCalender";
import TrackCard from "@/components/shared/track-shared-components/TrackCard";
import { Divider } from "@/components/ui/divider";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { getTrackCategoriesWithItemsAndProgress } from "@/services/core/TrackService";
import { ROUTES } from "@/utils/route";
import palette from "@/utils/theme/color";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackScreen() {
  const router = useRouter();

  const { patient } = useContext(PatientContext);
  const {
    categories,
    setCategories,
    refreshData,
    setRefreshData,
    selectedDate,
    setSelectedDate,
  } = useContext(TrackContext);

  const [currentSelectedDate, setCurrentSelectedDate] = useState(moment());

  useEffect(() => {
    const formatted = currentSelectedDate.format("MM-DD-YYYY");
    if (selectedDate !== formatted) {
      setSelectedDate(formatted);
    }
  }, [currentSelectedDate, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      if (!patient) {
        router.replace(ROUTES.MY_HEALTH);
        return;
      }

      const loadTrackItemsForSelectedDate = async () => {
        const res = await getTrackCategoriesWithItemsAndProgress(
          patient.id,
          currentSelectedDate.format("MM-DD-YYYY")
        );
        setCategories(res);
        setRefreshData(false);
      };

      loadTrackItemsForSelectedDate();
    }, [patient, currentSelectedDate, refreshData])
  );

  const handleAddItem = () => {
    router.push({
      pathname: "/home/track/addItem",
      params: { date: currentSelectedDate.format("MM-DD-YYYY") },
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
