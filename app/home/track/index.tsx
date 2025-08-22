import Header from "@/components/shared/Header";
import { Divider } from "@/components/ui/divider";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { getTrackCategoriesWithItemsAndProgress } from "@/services/core/TrackService";
import { ROUTES } from "@/utils/route";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
    });
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* header */}
      <Header title="Track" />
      <TouchableOpacity
        className="py-3 rounded-lg items-center"
        onPress={handleAddItem}
      >
        <View className="bg-white px-3 py-1.5 rounded-lg">
          <Text>Add Item</Text>
        </View>
      </TouchableOpacity>

      <Divider className="my-0.5" />

      <TouchableOpacity
        className="py-3 rounded-lg items-center"
        onPress={() =>
          router.push({
            pathname: "/home/track/questions/[itemId]",
            params: {
              itemId: "1",
              itemName: "Track Item 01",
              entryId: "2",
            },
          })
        }
      >
        <View className="bg-white px-3 py-1.5 rounded-lg">
          <Text>Questions Screen</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
