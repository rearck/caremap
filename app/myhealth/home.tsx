import {
  initializeSession,
  signOut,
} from "@/services/auth-service/google-auth";
import { PatientService } from "@/services/database/services/PatientService";
import { UserService } from "@/services/database/services/UserService";
import { Patient, User } from "@/services/database/migrations/v1/schema_v1";
import { logger } from "@/services/logging/logger";
import { ROUTES } from "@/utils/route";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);

  const db = useSQLiteContext();
  const userService = new UserService(db);
  const patientService = new PatientService(db);

  useEffect(() => {
    logger.debug(`DB Path : "${db.databasePath}"`);
    initializeSession(setUser).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleUserPatientState = async () => {
      if (!user) return;
      try {
        await userService.createUser(user);
        if (!patient) {
          await patientService.createPatient(user);
          const patientData = await patientService.getPatientByUserId(user.id);
          setPatient(patientData);
        }
      } catch (error) {
        logger.debug("Error: ", error);
      }
    };
    handleUserPatientState();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.replace(`${ROUTES.LOGIN}`);
  };

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{ uri: user.picture }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Patient name: {patient?.name}</Text>

      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Home;
