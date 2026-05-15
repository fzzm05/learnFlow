import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCourseStore } from "@/stores/course-store";

// Mock data for instructor courses
const instructorCourses = [
  {
    id: "c1",
    title: "React - The Complete Guide 2024",
    subtitle: "Dive in and learn React.js from scratch",
    rating: "4.8",
    duration: "50h",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "c2",
    title: "Next.js 14 & React - The Complete Guide",
    subtitle: "Learn NextJS from the ground up",
    rating: "4.7",
    duration: "32h",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "c3",
    title: "NodeJS - The Complete Guide",
    subtitle: "Master Node JS & Deno.js, build REST APIs",
    rating: "4.6",
    duration: "40h",
    image: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=300&auto=format&fit=crop"
  }
];

export default function InstructorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const instructor = useCourseStore((state) => state.instructors.find((item) => item.id === id));

  // If we can't find the instructor, we'll just mock the main one from the mockup
  const name = instructor?.name || "Maximilian Schwarzmüller";
  const headline = instructor?.headline || "Professional Web Developer and Instructor";
  const avatar = instructor?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} className="p-2">
          <Feather name="arrow-left" size={24} color="#EFEFEF" />
        </Pressable>
        <Pressable className="p-2">
          <Feather name="share-2" size={20} color="#EFEFEF" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View className="items-center px-4 pt-4">
          <ExpoImage
            source={{ uri: avatar }}
            className="h-32 w-32 rounded-full border border-border"
            contentFit="cover"
          />
          <Text className="mt-4 text-center text-[24px] font-bold text-primary">{name}</Text>
          <Text className="mt-1 text-center text-[14px] text-secondary">{headline}</Text>

          {/* Social Row */}
          <View className="mt-6 flex-row gap-4">
            <Pressable className="h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-border bg-surface">
              <Feather name="globe" size={18} color="#EFEFEF" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-border bg-surface">
              <Feather name="youtube" size={18} color="#EFEFEF" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-border bg-surface">
              <Feather name="code" size={18} color="#EFEFEF" />
            </Pressable>
          </View>

          {/* Stats */}
          <View className="mt-8 w-full flex-row justify-between rounded-xl border-[0.5px] border-border bg-surface p-5">
            <View className="items-center">
              <Text className="text-[18px] font-bold text-primary">4.7</Text>
              <View className="mt-1 flex-row items-center">
                <Ionicons name="star-outline" size={10} color="#F59E0B" />
                <Text className="ml-1 text-[10px] font-bold tracking-wider text-secondary">RATING</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-[18px] font-bold text-primary">8.2k</Text>
              <Text className="mt-1 text-[10px] font-bold tracking-wider text-secondary">REVIEWS</Text>
            </View>
            <View className="items-center">
              <Text className="text-[18px] font-bold text-primary">320k</Text>
              <Text className="mt-1 text-[10px] font-bold tracking-wider text-secondary">STUDENTS</Text>
            </View>
            <View className="items-center">
              <Text className="text-[18px] font-bold text-primary">42</Text>
              <Text className="mt-1 text-[10px] font-bold tracking-wider text-secondary">COURSES</Text>
            </View>
          </View>
        </View>

        {/* About Me */}
        <View className="mt-8 px-4">
          <Text className="text-[20px] font-bold text-primary">About Me</Text>
          <Text className="mt-3 text-[14px] leading-6 text-secondary">
            Starting out at the age of 12 I never stopped learning new programming skills and languages. Early I started
            creating websites for friends and just for fun as well. Besides web development I also explored Python an...
          </Text>
          <Pressable className="mt-1">
            <Text className="text-[14px] font-medium text-accent">Show more</Text>
          </Pressable>
        </View>

        {/* Courses */}
        <View className="mt-8 px-4">
          <Text className="mb-4 text-[20px] font-bold text-primary">My Courses on LearnFlow</Text>
          
          <View className="gap-4">
            {instructorCourses.map((course) => (
              <Pressable key={course.id} className="flex-row overflow-hidden rounded-xl border-[0.5px] border-border bg-surface h-28">
                <ExpoImage source={{ uri: course.image }} contentFit="cover" className="h-full w-28 bg-border" />
                <View className="flex-1 justify-center p-3">
                  <Text className="text-[14px] font-semibold text-primary" numberOfLines={1}>{course.title}</Text>
                  <Text className="mt-1 text-[12px] text-secondary" numberOfLines={1}>{course.subtitle}</Text>
                  <View className="mt-4 flex-row items-center gap-4">
                    <View className="flex-row items-center">
                      <Ionicons name="star-outline" size={14} color="#F59E0B" />
                      <Text className="ml-1 text-[12px] text-primary">{course.rating}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Feather name="clock" size={12} color="#8a8a8a" />
                      <Text className="ml-1 text-[12px] text-secondary">{course.duration}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable className="mt-6 items-center justify-center rounded-lg border-[0.5px] border-border bg-transparent py-4">
            <Text className="text-[15px] font-bold text-primary">View All 42 Courses</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
