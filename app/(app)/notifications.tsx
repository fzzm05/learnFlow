import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ensureNotificationPermissions, scheduleInactivityReminder, sendInstantTestNotification } from "@/lib/notifications";
import { usePreferencesStore } from "@/stores/preferences-store";

// Only notification types that are actually implemented in the app
const NOTIFICATION_SETTINGS = [
  {
    id: "inactivity",
    label: "Inactivity Reminders",
    description: "Get nudged when you haven't opened the app in 24 hours",
    icon: "clock"
  },
  {
    id: "bookmark_milestone",
    label: "Wishlist Milestones",
    description: "Celebrate when you save 5 or more courses to your wishlist",
    icon: "heart"
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = usePreferencesStore((s) => s.setNotificationsEnabled);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [inactivityEnabled, setInactivityEnabled] = useState(true);
  const [bookmarkMilestoneEnabled, setBookmarkMilestoneEnabled] = useState(true);

  useEffect(() => {
    ensureNotificationPermissions().then(setPermissionGranted);
  }, []);

  async function handleMasterToggle(value: boolean) {
    if (value && !permissionGranted) {
      const granted = await ensureNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications for LearnFlow in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
      setPermissionGranted(true);
    }
    await setNotificationsEnabled(value);
    if (value) {
      await scheduleInactivityReminder();
    }
  }

  async function handleSubToggle(id: string, value: boolean) {
    if (!notificationsEnabled) return;
    if (id === "inactivity") {
      setInactivityEnabled(value);
      if (value) {
        await scheduleInactivityReminder();
      } else {
        // Cancel the scheduled inactivity reminder
        const { default: Notifications } = await import("expo-notifications");
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } else if (id === "bookmark_milestone") {
      setBookmarkMilestoneEnabled(value);
    }
  }

  async function handleTestNotification() {
    const sent = await sendInstantTestNotification();
    if (!sent) {
      Alert.alert("Unavailable", "Notifications are not supported in this environment.");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center gap-4 px-4 py-3 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
        >
          <Feather name="arrow-left" size={20} color="#EFEFEF" />
        </Pressable>
        <Text className="text-[22px] font-bold text-primary">Notifications</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Master Toggle */}
        <View className="mx-4 mt-2 rounded-xl border-[0.5px] border-border bg-surface">
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#2b4c44]">
                <Feather name="bell" size={18} color="#95D1BD" />
              </View>
              <View>
                <Text className="text-[15px] font-semibold text-primary">All Notifications</Text>
                <Text className="mt-0.5 text-[12px] text-secondary">
                  {notificationsEnabled ? "Notifications are on" : "Notifications are off"}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleMasterToggle}
              trackColor={{ false: "#2e2e2e", true: "#2b4c44" }}
              thumbColor={notificationsEnabled ? "#95D1BD" : "#8a8a8a"}
            />
          </View>

          {!permissionGranted && (
            <Pressable
              onPress={() => Linking.openSettings()}
              className="mx-4 mb-4 flex-row items-center gap-2 rounded-lg bg-[#451A03] px-3 py-2.5"
            >
              <Feather name="alert-triangle" size={14} color="#92400E" />
              <Text className="flex-1 text-[12px] text-[#92400E]">
                System permission not granted — tap to open Settings
              </Text>
              <Feather name="chevron-right" size={14} color="#92400E" />
            </Pressable>
          )}
        </View>

        {/* Per-type settings */}
        <Text className="mb-3 ml-5 mt-8 text-[10px] font-bold tracking-widest text-secondary">
          NOTIFICATION TYPES
        </Text>
        <View className="mx-4 rounded-xl border-[0.5px] border-border bg-surface">
          {NOTIFICATION_SETTINGS.map((setting, i) => {
            const isOn = notificationsEnabled && (setting.id === "inactivity" ? inactivityEnabled : bookmarkMilestoneEnabled);
            return (
              <View
                key={setting.id}
                className={`flex-row items-center justify-between p-4 ${
                  i !== NOTIFICATION_SETTINGS.length - 1 ? "border-b-[0.5px] border-border" : ""
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1 mr-3">
                  <Feather
                    name={setting.icon as any}
                    size={18}
                    color={notificationsEnabled ? "#EFEFEF" : "#8a8a8a"}
                  />
                  <View className="flex-1">
                    <Text
                      className={`text-[14px] font-medium ${notificationsEnabled ? "text-primary" : "text-secondary"}`}
                    >
                      {setting.label}
                    </Text>
                    <Text className="mt-0.5 text-[12px] text-secondary">{setting.description}</Text>
                  </View>
                </View>
                <Switch
                  value={isOn}
                  onValueChange={(val) => handleSubToggle(setting.id, val)}
                  trackColor={{ false: "#2e2e2e", true: "#2b4c44" }}
                  thumbColor={isOn ? "#95D1BD" : "#8a8a8a"}
                  disabled={!notificationsEnabled}
                />
              </View>
            );
          })}
        </View>

        {/* Test notification */}
        <Text className="mb-3 ml-5 mt-8 text-[10px] font-bold tracking-widest text-secondary">
          DEVELOPER
        </Text>
        <View className="mx-4 rounded-xl border-[0.5px] border-border bg-surface">
          <Pressable
            onPress={handleTestNotification}
            className="flex-row items-center justify-between p-4"
            disabled={!notificationsEnabled}
          >
            <View className="flex-row items-center gap-3">
              <Feather name="send" size={18} color={notificationsEnabled ? "#EFEFEF" : "#8a8a8a"} />
              <Text className={`text-[14px] font-medium ${notificationsEnabled ? "text-primary" : "text-secondary"}`}>
                Send Test Notification
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8a8a8a" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
