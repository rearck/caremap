import Header from "@/components/shared/Header";
import { PatientContext } from "@/context/PatientContext";
import { TrackContext } from "@/context/TrackContext";
import { UserContext } from "@/context/UserContext";
import { TrackCategoryWithSelectableItems } from "@/services/common/types";
import {
  addTrackItemOnDate,
  getAllCategoriesWithSelectableItems,
  removeTrackItemFromDate,
} from "@/services/core/TrackService";
import { ROUTES } from "@/utils/route";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddItem() {
  const router = useRouter();

  const { user } = useContext(UserContext);
  const { patient } = useContext(PatientContext);
  const { selectedDate, setRefreshData } = useContext(TrackContext);
  const [selectableCategories, setSelectableCategories] = useState<
    TrackCategoryWithSelectableItems[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!patient) {
      router.replace(ROUTES.MY_HEALTH);
      return;
    }

    const loadSelectableItems = async () => {
      const res = await getAllCategoriesWithSelectableItems(
        patient.id,
        selectedDate
      );

      setSelectableCategories(res);
    };
    loadSelectableItems();
  }, [patient, selectedDate]);

  const toggleSelect = (categoryIndex: number, itemIndex: number) => {
    setSelectableCategories((prev) => {
      const categoryGroup = prev[categoryIndex];
      const items = categoryGroup.items.map((item, i) =>
        i === itemIndex ? { ...item, selected: !item.selected } : item
      );

      const updatedGroup = { ...categoryGroup, items };

      return prev.map((group, i) =>
        i === categoryIndex ? updatedGroup : group
      );
    });
  };

  const handleSave = async () => {
    if (!user?.id) throw new Error("Authentication ERROR");
    if (!patient?.id) throw new Error("Authentication ERROR");

    setIsLoading(true);

    try {
      const selected = [];
      for (const categoryGroup of selectableCategories) {
        for (const itemObj of categoryGroup.items) {
          const actionPromise = itemObj.selected
            ? addTrackItemOnDate(
                itemObj.item.id,
                user.id,
                patient.id,
                selectedDate
              )
            : removeTrackItemFromDate(
                itemObj.item.id,
                user.id,
                patient.id,
                selectedDate
              );

          selected.push(actionPromise);
        }
      }

      await Promise.all(selected);

      setRefreshData(true);
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* header */}
      <Header title="Add Item" />
    </SafeAreaView>
  );
}
