import Constants from "expo-constants";
import { Platform } from "react-native";

import { INACTIVITY_HOURS } from "@/config/constants";

type NotificationsModule = typeof import("expo-notifications");

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;

async function getNotificationsModule() {
  if (Constants.executionEnvironment === "storeClient") {
    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = import("expo-notifications")
      .then((module) => {
        module.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true
          })
        });
        return module;
      })
      .catch(() => null);
  }

  return notificationsModulePromise;
}

export async function ensureNotificationPermissions() {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return false;
  }

  const existing = await notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }

  const requested = await notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function prepareNotificationChannel() {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return;
  }

  if (Platform.OS === "android") {
    await notifications.setNotificationChannelAsync("learnflow-default", {
      name: "LearnFlow",
      importance: notifications.AndroidImportance.DEFAULT
    });
  }
}

export async function sendBookmarkMilestoneNotification(count: number) {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return;
  }

  await notifications.scheduleNotificationAsync({
    content: {
      title: "Learning streak unlocked",
      body: `You have bookmarked ${count} courses. Time to enroll in your next one.`
    },
    trigger: null
  });
}

export async function sendInstantTestNotification() {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return false;
  }

  await notifications.scheduleNotificationAsync({
    content: {
      title: "LearnFlow test notification",
      body: "Your local notification pipeline is working."
    },
    trigger: null
  });

  return true;
}

export async function scheduleTestReminder(seconds: number) {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return false;
  }

  await notifications.scheduleNotificationAsync({
    content: {
      title: "LearnFlow scheduled test",
      body: `This reminder was scheduled ${seconds} seconds ago.`
    },
    trigger: {
      type: notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds
    }
  });

  return true;
}

export async function scheduleInactivityReminder() {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return;
  }

  await notifications.cancelAllScheduledNotificationsAsync();

  await notifications.scheduleNotificationAsync({
    content: {
      title: "Come back to LearnFlow",
      body: "Your saved courses are waiting for you."
    },
    trigger: {
      type: notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: INACTIVITY_HOURS * 60 * 60
    }
  });
}
