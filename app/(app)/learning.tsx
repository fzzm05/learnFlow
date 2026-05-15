import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCourseStore } from "@/stores/course-store";
import { Skeleton } from "@/components/skeleton";
import { useInteractionReady } from "@/hooks/use-interaction-ready";

const MyLearningSkeleton = () => (
  <View className="flex-1 bg-background px-4">
    <View className="mb-6 mt-4 flex-row gap-3">
      <Skeleton className="h-10 w-16 rounded-full" />
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-10 w-20 rounded-full" />
    </View>
    <Text className="text-[20px] font-bold text-primary mb-4 mt-2">My Courses</Text>
    <View className="gap-6">
      {[1, 2].map(i => (
        <View key={i} className="overflow-hidden rounded-xl border-[0.5px] border-border bg-surface">
          <Skeleton className="h-36 w-full" />
          <View className="p-4 gap-3">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-2 w-full rounded-full mt-4" />
            <Skeleton className="h-10 w-24 rounded-lg self-end mt-2" />
          </View>
        </View>
      ))}
    </View>
  </View>
);

const MOCK_LEARNING_COURSES = [
  {
    id: "m1",
    title: "Advanced React Native: Build Enterprise Apps",
    instructorName: "Sarah Drasner",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    progress: 68,
    timeLeft: "2h 15m left",
    isPrimary: true
  },
  {
    id: "m2",
    title: "System Design Interview Mastery",
    instructorName: "Alex Xu",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    progress: 12,
    timeLeft: "15h 30m left",
    isPrimary: false
  }
];

export default function MyLearningScreen() {
  const router = useRouter();
  const courses = useCourseStore((state) => state.courses);
  const enrolledCourses = courses.filter((c) => c.isEnrolled);
  const [activeTab, setActiveTab] = useState("All");
  const isReady = useInteractionReady();

  const tabs = ["All", "In Progress", "Archived", "Favourites"];

  // Use real enrolled courses if available, otherwise fallback to mock to show UI
  const displayCourses = enrolledCourses.length > 0 
    ? enrolledCourses.map((course, index) => ({
        id: course.id,
        title: course.title,
        instructorName: course.instructorName,
        thumbnail: course.thumbnail,
        progress: index === 0 ? 68 : 12, // Mocked progress
        timeLeft: index === 0 ? "2h 15m left" : "15h 30m left", // Mocked time
        isPrimary: index === 0 // Make the first one primary CTA
      }))
    : MOCK_LEARNING_COURSES;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 pb-4">
        <Text className="text-[24px] font-bold text-primary">My Learning</Text>
        <Pressable 
          onPress={() => router.push("/cart")}
          className="h-10 w-10 items-center justify-center"
        >
          <Feather name="shopping-cart" size={20} color="#EFEFEF" />
        </Pressable>
      </View>

      {!isReady ? (
        <MyLearningSkeleton />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View className="mt-4 px-4 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3 pr-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <Pressable
                    key={tab}
                    android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                    onPress={() => setActiveTab(tab)}
                    className={`active:opacity-80 rounded-full border-[0.5px] px-5 py-2 ${
                      isActive ? "border-accent bg-transparent" : "border-border bg-transparent"
                    }`}
                  >
                    <Text className={`text-[14px] ${isActive ? "text-accent" : "text-primary"}`}>{tab}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Course List */}
        <View className="mt-6 gap-6 px-4 pb-8">
          <Text className="text-[20px] font-bold text-primary mb-2">My Courses</Text>
          {displayCourses.map((course) => (
            <Pressable
              key={course.id}
              android_ripple={{ color: "rgba(255,255,255,0.1)" }}
              onPress={() => router.push(`/courses/${course.id}`)}
              className="active:opacity-80 overflow-hidden rounded-xl border-[0.5px] border-border bg-surface"
            >
              <ExpoImage source={{ uri: course.thumbnail }} contentFit="cover" style={{ height: 144, width: "100%" }} className="bg-border" />
              <View className="p-4">
                <Text className="text-[16px] font-bold text-primary leading-6" numberOfLines={2}>{course.title}</Text>
                <Text className="mt-1 text-[14px] text-secondary">{course.instructorName}</Text>

                {/* Progress */}
                <View className="mt-5">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-[10px] font-medium tracking-wider text-primary">
                      {course.progress}% Complete
                    </Text>
                    <Text className="text-[10px] font-medium tracking-wider text-secondary">
                      {course.timeLeft}
                    </Text>
                  </View>
                  <View className="h-1 w-full overflow-hidden rounded-full bg-border">
                    <View className="h-full bg-accent" style={{ width: `${course.progress}%` }} />
                  </View>
                </View>

                {/* Button */}
                <View className="mt-6 flex-row justify-end">
                  <Pressable
                    android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                    className={`active:opacity-80 rounded-lg px-6 py-2.5 ${
                      course.isPrimary ? "bg-accent" : "border-[0.5px] border-border bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-[14px] font-semibold ${
                        course.isPrimary ? "text-background" : "text-primary"
                      }`}
                    >
                      Continue
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
