import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

import {
  initializeSession,
  signOut,
} from "@/services/auth-service/google-auth";
import { Patient, User } from "@/services/database/migrations/v1/schema_v1";
import { useSQLiteContext } from "expo-sqlite";
import { PatientModel } from "@/services/database/models/PatientModel";
import { useRouter } from "expo-router";
import { ROUTES } from "@/utils/route";

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = useSQLiteContext();
  const patientModel = new PatientModel(db);

  useEffect(() => {
    initializeSession(setUser).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      handlePatientData(user.id);
    }
  }, [user]);

  const handlePatientData = async (userId: string) => {
    try {
      const patientData = await patientModel.getPatientByUserId(userId);
      if (patientData) {
        setPatient(patientData);
        setNewPatient(patientData);
      } else {
        await patientModel.insert({
          user_id: userId,
          name: user?.name || "",
        });
        const newPatientData = await patientModel.getPatientByUserId(userId);
        setPatient(newPatientData);
        setNewPatient(newPatientData);
      }
    } catch (err) {
      console.log("Patient Error: ", err);
    }
  };
  const isValidDate = (dateStr: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!isValidDate(newPatient?.birthdate ?? "")) {
      alert("Please enter a valid date in YYYY-MM-DD format");
      return;
    }
    try {
      await patientModel.updateByFields(
        {
          age: newPatient?.age,
          weight: newPatient?.weight,
          relationship: newPatient?.relationship,
          gender: newPatient?.gender,
          birthdate: newPatient?.birthdate,
        },
        { user_id: user.id }
      );

      const updatedPatient = await patientModel.getPatientByUserId(user.id);
      setPatient(updatedPatient);

      console.log("Profile updated");

      router.replace(ROUTES.MY_HEALTH);
    } catch (err) {
      console.log(" Save Error: ", err);
    }
  };

  if (loading || !user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-2 bg-[#49AFBE]">
        <Text className="text-xl text-white font-bold text-center">
          Edit Profile
        </Text>

        <View className="flex-row mb-5 items-center justify-start px-4 ">
          <Avatar size="xl">
            <AvatarImage source={{ uri: user.picture }} />
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-1 ">
              <Icon as={Camera} size="sm" className="text-black" />
            </View>
          </Avatar>
          <View className="ml-16">
            <Text className="text-lg text-white font-semibold">
              {patient?.name}
            </Text>
            <Text className="text-white">Age: {patient?.age}</Text> 
            <Text className="text-white">Weight: {patient?.weight} kg</Text>
          </View>
        </View>
      </View>
    {/* edit profile form -newPatient*/}
      <View className="p-4">
        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Name</Text>
          <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
            <Text className="text-gray-700">{newPatient?.name ?? user.name}</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Age</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-700"
            keyboardType="numeric"
            value={newPatient?.age?.toString() ?? ""}
            onChangeText={(text) =>
              setNewPatient((prev) =>
                prev ? { ...prev, age: parseInt(text) } : prev
              )
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Date of Birth</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-700"
            value={newPatient?.birthdate || ""}
            placeholder="YYYY-MM-DD"
            onChangeText={(text) =>
              setNewPatient((prev) => (prev ? { ...prev, birthdate: text } : prev))
            }
            keyboardType="numeric"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Weight (in Kg)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-700"
            keyboardType="numeric"
            value={newPatient?.weight?.toString() ?? ""}
            onChangeText={(text) =>
              setNewPatient((prev) =>
                prev ? { ...prev, weight: parseFloat(text) } : prev
              )
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1">Relationship</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-700"
            value={newPatient?.relationship}
            onChangeText={(text) =>
              setNewPatient((prev) =>
                prev ? { ...prev, relationship: text } : prev
              )
            }
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-500 text-sm mb-1">Gender</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-700"
            value={newPatient?.gender}
            onChangeText={(text) =>
              setNewPatient((prev) => (prev ? { ...prev, gender: text } : prev))
            }
          />
        </View>

        <TouchableOpacity
          className="bg-[#49AFBE] py-3 rounded-lg"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-center">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
