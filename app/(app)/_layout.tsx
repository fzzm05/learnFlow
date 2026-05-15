import { useMemo } from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { OfflineBanner } from "@/components/offline-banner";

export default function AppLayout() {
  useProtectedRoute();
  const insets = useSafeAreaInsets();
  
  const tabHeight = 60 + insets.bottom;

  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: "#222222",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTopWidth: 0,
      height: 64 + insets.bottom,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      elevation: 8,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    tabBarItemStyle: {
      justifyContent: "center",
      alignItems: "center",
    },
    tabBarIconStyle: {
      width: 24,
      height: 24,
    },
    tabBarLabelPosition: "beside-icon",
    tabBarActiveTintColor: "#95D1BD",
    tabBarInactiveTintColor: "#8a8a8a",
  }), [insets.bottom, tabHeight]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Discover",
            tabBarIcon: ({ color, size }) => <Feather name="compass" size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="learning"
          options={{
            title: "My Learning",
            tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: "Wishlist",
            tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />
          }}
        />
        <Tabs.Screen name="profile" options={{ title: "Account", tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }} />
        <Tabs.Screen name="quiz" options={{ href: null }} />
        <Tabs.Screen name="instructor/[id]" options={{ href: null }} />
        <Tabs.Screen name="about" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
      </Tabs>
      <OfflineBanner bottomInset={tabHeight} />
    </View>
  );
}
