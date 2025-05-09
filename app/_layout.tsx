import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <GluestackUIProvider mode="light">
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#F1FDFF",
          },
          headerBackVisible: false,
        }}
      />
    </GluestackUIProvider>
  );
};

export default RootLayout;
