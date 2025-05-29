import React, { useEffect, useState } from "react";
import { View, Text, Image, Button } from "react-native";
import { router } from "expo-router";
import {
  initializeSession,
  signOut,
} from "@/services/auth-service/google-auth";
import { User } from "@/services/database/migrations/v1/schema_v1";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSession(setUser).finally(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/login");
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
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Home;
