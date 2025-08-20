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
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddItem() {
  const router = useRouter();

  const { user } = useContext(UserContext);
  const { patient } = useContext(PatientContext);
  const { selectedDate, setRefreshData } = useContext(TrackContext);
  const [selectableCategories, setSelectableCategories] = useState<
    TrackCategoryWithSelectableItems[]
  >([]);
  const selectableCategoriesRef = useRef<TrackCategoryWithSelectableItems[]>(
    []
  );
  const initialCategoriesRef = useRef<TrackCategoryWithSelectableItems[]>([]);

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

      selectableCategoriesRef.current = res;
      initialCategoriesRef.current = res;
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
      const next = prev.map((group, i) =>
        i === categoryIndex ? updatedGroup : group
      );
      selectableCategoriesRef.current = next;
      return next;
    });
  };

  const handleSave = async () => {
    if (isLoading) return;
    if (!user?.id) throw new Error("Authentication ERROR");
    if (!patient?.id) throw new Error("Authentication ERROR");

    setIsLoading(true);

    try {
      const current = selectableCategoriesRef.current;
      const initial = initialCategoriesRef.current;

      const initialMap: Record<number, boolean> = {};
      for (const group of initial) {
        for (const it of group.items) {
          initialMap[it.item.id] = !!it.selected;
        }
      }

      const toAdd: number[] = [];
      const toRemove: number[] = [];
      for (const group of current) {
        for (const it of group.items) {
          const wasSelected = initialMap[it.item.id] ?? false;
          const isSelected = !!it.selected;
          if (isSelected !== wasSelected) {
            if (isSelected) toAdd.push(it.item.id);
            else toRemove.push(it.item.id);
          }
        }
      }

      for (const itemId of toAdd) {
        await addTrackItemOnDate(itemId, user.id, patient.id, selectedDate);
      }
      for (const itemId of toRemove) {
        await removeTrackItemFromDate(
          itemId,
          user.id,
          patient.id,
          selectedDate
        );
      }

      initialCategoriesRef.current = selectableCategoriesRef.current;

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
