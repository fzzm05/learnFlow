import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMemo } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { useAuthStore } from "@/stores/auth-store";
import { useCourseStore } from "@/stores/course-store";
import { Skeleton } from "@/components/skeleton";
import { useInteractionReady } from "@/hooks/use-interaction-ready";

const ProfileSkeleton = () => (
  <View className="flex-1 pb-10">
    <View className="items-center px-4 pt-10">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="mt-4 h-6 w-48 rounded-md" />
      <Skeleton className="mt-2 h-4 w-32 rounded-md" />
    </View>
    <View className="mt-8 flex-row gap-3 px-4">
      <Skeleton className="flex-1 h-20 rounded-xl" />
      <Skeleton className="flex-1 h-20 rounded-xl" />
      <Skeleton className="flex-1 h-20 rounded-xl" />
    </View>
    <View className="mt-8 px-4 gap-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </View>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setLocalAvatar = useAuthStore((state) => state.setLocalAvatar);
  const courses = useCourseStore((state) => state.courses);
  const isReady = useInteractionReady();

  const stats = useMemo(() => {
    const enrolled = courses.filter((course) => course.isEnrolled).length;
    const bookmarked = courses.filter((course) => course.isBookmarked).length;
    return { enrolled, bookmarked, completed: 3 }; // Mocking completed since we don't track progress yet
  }, [courses]);

  async function handleImagePick() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (uri) {
        await setLocalAvatar(uri);
      }
    }
  }

  const sections = [
    {
      title: "ACCOUNT",
      items: [
        { icon: "user", label: "Edit Profile" },
        { icon: "bell", label: "Notification Settings", route: "/(app)/notifications" }
      ]
    },
    {
      title: "LEARNING",
      items: [
        { icon: "book-open", label: "Enrolled Courses" }, // feather equivalent for graduation cap is book-open or similar
        { icon: "award", label: "Certificates" }
      ]
    },
    {
      title: "SUPPORT",
      items: [
        { icon: "help-circle", label: "Help Center" },
        { icon: "info", label: "About LearnFlow", route: "/(app)/about" }
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 pb-4">
        <Text className="text-[24px] font-bold text-primary">Account</Text>
        <Pressable 
          onPress={() => router.push("/cart")}
          className="h-10 w-10 items-center justify-center"
        >
          <Feather name="shopping-cart" size={20} color="#EFEFEF" />
        </Pressable>
      </View>

      {!isReady ? (
        <ProfileSkeleton />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View className="items-center px-4 pt-10">
          <View className="relative">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 96, height: 96, borderRadius: 999, borderWidth: 0.5, borderColor: "#333333" }}
                resizeMode="cover"
              />
            ) : (
              <View 
                className="items-center justify-center bg-surface"
                style={{ width: 96, height: 96, borderRadius: 999, borderWidth: 0.5, borderColor: "#333333" }}
              >
                <Feather name="user" size={40} color="#8a8a8a" />
              </View>
            )}
            <Pressable 
              onPress={() => void handleImagePick()}
              className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full bg-[#3A3A3A] border-[0.5px] border-border"
            >
              <Feather name="edit-2" size={12} color="#EFEFEF" />
            </Pressable>
          </View>
          
          <Text className="mt-4 text-[24px] font-bold text-primary">{user?.name ?? "Alex Morgan"}</Text>
          <Text className="mt-1 text-[14px] text-secondary">{user?.email ?? "alex.morgan@example.com"}</Text>
        </View>

        {/* Stats Row */}
        <View className="mt-8 flex-row gap-3 px-4">
          <View className="flex-1 items-center justify-center rounded-xl border-[0.5px] border-border py-4">
            <Text className="text-[20px] font-bold text-primary">{stats.enrolled}</Text>
            <Text className="mt-1 text-[10px] font-bold tracking-widest text-secondary">COURSES</Text>
          </View>
          <View className="flex-1 items-center justify-center rounded-xl border-[0.5px] border-border py-4">
            <Text className="text-[20px] font-bold text-accent">{stats.completed}</Text>
            <Text className="mt-1 text-[10px] font-bold tracking-widest text-secondary">COMPLETED</Text>
          </View>
          <View className="flex-1 items-center justify-center rounded-xl border-[0.5px] border-border py-4">
            <Text className="text-[20px] font-bold text-[#F59E0B]">{stats.bookmarked}</Text>
            <Text className="mt-1 text-[10px] font-bold tracking-widest text-secondary">BOOKMARKED</Text>
          </View>
        </View>

        {/* Sections */}
        <View className="mt-8 px-4 gap-6">
          {sections.map((section, idx) => (
            <View key={idx}>
              <Text className="mb-3 text-[10px] font-bold tracking-widest text-secondary ml-1">
                {section.title}
              </Text>
              <View className="rounded-xl border-[0.5px] border-border bg-surface">
                {section.items.map((item, i) => (
                  <Pressable 
                    key={i} 
                    onPress={() => item.route && router.push(item.route as any)}
                    className={`flex-row items-center justify-between p-4 ${i !== section.items.length - 1 ? "border-b-[0.5px] border-border" : ""}`}
                  >
                    <View className="flex-row items-center">
                      <Feather name={item.icon as any} size={18} color="#EFEFEF" />
                      <Text className="ml-4 text-[15px] text-primary">{item.label}</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="#8a8a8a" />
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          {/* Danger Actions */}
          <View className="rounded-xl border-[0.5px] border-border bg-surface">
            <Pressable 
              onPress={() =>
                Alert.alert("Log Out", "Are you sure you want to log out?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Log Out", style: "destructive", onPress: () => void logout() }
                ])
              }
              className="flex-row items-center p-4"
            >
              <Feather name="log-out" size={18} color="#FCA5A5" />
              <Text className="ml-4 text-[15px] text-red-300">Log Out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
