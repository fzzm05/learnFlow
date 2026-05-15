import NetInfo from "@react-native-community/netinfo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";
import { useAuthStore } from "@/stores/auth-store";
import { useCourseStore } from "@/stores/course-store";
import { Skeleton } from "@/components/skeleton";

const DiscoverSkeleton = () => (
  <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
    <View className="mb-6 flex-row items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <View className="ml-3 justify-center gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-3 w-24 rounded-md" />
      </View>
    </View>
    <View className="mb-8 overflow-hidden rounded-xl border-[0.5px] border-border bg-surface mt-2">
      <Skeleton className="h-48 w-full" />
      <View className="p-4 gap-3">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <View className="mt-2 flex-row items-center gap-4">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </View>
      </View>
    </View>
    <Skeleton className="mb-4 h-6 w-32 rounded-md" />
    <View className="mb-8 flex-row gap-3">
      <Skeleton className="h-10 w-28 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </View>
  </ScrollView>
);

export default function DiscoverScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const courses = useCourseStore((state) => state.courses);
  const isLoading = useCourseStore((state) => state.isLoading);
  const isRefreshing = useCourseStore((state) => state.isRefreshing);
  const error = useCourseStore((state) => state.error);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const refreshCourses = useCourseStore((state) => state.refreshCourses);
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);

  useFocusEffect(
    useCallback(() => {
      if (courses.length === 0) {
        void fetchCourses();
      }
    }, [courses.length, fetchCourses])
  );

  const featuredCourse = courses.length > 0 ? courses[0] : null;
  const recommendedCourses = courses.length > 1 ? courses.slice(1) : [];
  const continueCourse = courses.find(c => c.isEnrolled) || courses[0];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && courses.length === 0 && !isLoading) {
        void fetchCourses();
      }
    });
    return () => unsubscribe();
  }, [courses.length, isLoading, fetchCourses]);

  const renderHeader = () => (
    <View className="px-4">
      <View className="mb-6 mt-2 flex-row items-center">
        {user?.avatar ? (
          <Image 
            source={{ uri: user.avatar }} 
            style={{ width: 48, height: 48, borderRadius: 24 }}
            contentFit="cover"
          />
        ) : (
          <View 
            className="items-center justify-center bg-surface border-[0.5px] border-border" 
            style={{ width: 48, height: 48, borderRadius: 24 }}
          >
            <Feather name="user" size={24} color="#8a8a8a" />
          </View>
        )}
        <View className="ml-3 justify-center">
          <Text className="text-[20px] font-bold text-primary">
            Welcome, {user?.name || "Student"}
          </Text>
          {user?.occupation ? (
            <Text className="mt-0.5 text-[12px] text-secondary">
              {user.occupation}
              {user.interests && user.interests.length > 0 ? ` • ${user.interests.join(", ")}` : ""}
            </Text>
          ) : (
            <Pressable onPress={() => router.push("/(app)/profile")}>
              <Text className="mt-0.5 text-[12px] font-medium text-accent">Add occupation and interest</Text>
            </Pressable>
          )}
        </View>
      </View>

      {featuredCourse ? (
        <Pressable 
          android_ripple={{ color: "rgba(255,255,255,0.1)" }}
          onPress={() => router.push(`/courses/${featuredCourse.id}`)}
          className="active:opacity-80 mb-8 overflow-hidden rounded-xl border-[0.5px] border-border bg-surface mt-2"
        >
          <View className="relative">
            <Image 
              source={{ uri: featuredCourse.thumbnail }} 
              style={{ height: 192, width: "100%" }} 
              contentFit="cover" 
            />
            <View className="absolute left-4 top-4 rounded-full border-[0.5px] border-accent/30 bg-[#2b4c44]/80 px-3 py-1">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-accent">Featured</Text>
            </View>
          </View>
          <View className="p-4">
            <Text className="text-[18px] font-bold text-primary">{featuredCourse.title}</Text>
            <Text className="mt-2 text-[14px] leading-5 text-secondary" numberOfLines={2}>
              {featuredCourse.description}
            </Text>
            <View className="mt-4 flex-row items-center gap-4">
              <View className="flex-row items-center">
                <Feather name="clock" size={14} color="#8a8a8a" />
                <Text className="ml-1 text-[12px] text-secondary">4h 30m</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="star-outline" size={14} color="#EFEFEF" />
                <Text className="ml-1 text-[12px] text-primary">{featuredCourse.rating}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      ) : null}

      {continueCourse ? (
        <View className="mb-8">
          <Text className="mb-4 text-[20px] font-bold text-primary">Continue Learning</Text>
          <Pressable 
            onPress={() => router.push(`/courses/${continueCourse.id}`)}
            android_ripple={{ color: "rgba(255,255,255,0.1)" }} 
            className="active:opacity-80 flex-row items-center rounded-xl border-[0.5px] border-border bg-surface p-4"
          >
            <View className="h-12 w-12 overflow-hidden rounded-lg border-[0.5px] border-border bg-surface">
              <Image 
                source={{ uri: continueCourse.thumbnail }} 
                style={{ width: "100%", height: "100%" }} 
                contentFit="cover" 
              />
            </View>
            <View className="ml-4 flex-1 pr-4">
              <Text className="text-[15px] font-bold text-primary" numberOfLines={1}>{continueCourse.title}</Text>
              <Text className="mt-1 text-[12px] text-secondary" numberOfLines={1}>Module: {continueCourse.category}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="mr-2 h-1 w-12 overflow-hidden rounded-full bg-border">
                <View className="h-full w-[45%] bg-accent" />
              </View>
              <Text className="text-[10px] text-primary">45%</Text>
            </View>
          </Pressable>
        </View>
      ) : null}

      <Text className="mb-4 text-[20px] font-bold text-primary">Explore Topics</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
        <View className="flex-row gap-3 pr-4">
          <Pressable android_ripple={{ color: "rgba(255,255,255,0.1)" }} className="active:opacity-80 flex-row items-center rounded-lg border-[0.5px] border-border bg-surface px-4 py-3">
            <Feather name="code" size={16} color="#95D1BD" />
            <Text className="ml-2 text-[14px] font-medium text-primary">Development</Text>
          </Pressable>
          <Pressable android_ripple={{ color: "rgba(255,255,255,0.1)" }} className="active:opacity-80 flex-row items-center rounded-lg border-[0.5px] border-border bg-surface px-4 py-3">
            <Ionicons name="brush" size={16} color="#F59E0B" />
            <Text className="ml-2 text-[14px] font-medium text-primary">Design</Text>
          </Pressable>
          <Pressable android_ripple={{ color: "rgba(255,255,255,0.1)" }} className="active:opacity-80 flex-row items-center rounded-lg border-[0.5px] border-border bg-surface px-4 py-3">
            <Feather name="trending-up" size={16} color="#ec4899" />
            <Text className="ml-2 text-[14px] font-medium text-primary">Business</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-[20px] font-bold text-primary">Recommended for You</Text>
      </View>
    </View>
  );



  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-end px-4 py-3 pb-4">
        <Pressable 
          onPress={() => router.push("/cart")}
          className="h-10 w-10 items-center justify-center"
        >
          <Feather name="shopping-cart" size={20} color="#EFEFEF" />
        </Pressable>
      </View>

      {isLoading ? <DiscoverSkeleton /> : null}

      {!isLoading && error ? (
        <ScrollView 
          contentContainerStyle={{ flex: 1, paddingTop: 32, paddingHorizontal: 16 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshCourses()} tintColor="#95D1BD" />}
        >
          <EmptyState title="Catalog unavailable" description={error} />
        </ScrollView>
      ) : null}

      {!isLoading && !error && courses.length === 0 ? (
        <ScrollView 
          contentContainerStyle={{ flex: 1, paddingTop: 32, paddingHorizontal: 16 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshCourses()} tintColor="#95D1BD" />}
        >
          <EmptyState
            title="No courses found"
            description="Try refreshing to load the catalog."
          />
        </ScrollView>
      ) : null}

      {!isLoading && !error && courses.length > 0 ? (
        <LegendList
          data={recommendedCourses}
          keyExtractor={(item) => item.id}
          estimatedItemSize={120}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListHeaderComponent={renderHeader}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshCourses()} tintColor="#95D1BD" />}
          renderItem={({ item }) => (
            <View className="px-4">
              <CourseCard
                course={item}
                onPress={() => router.push(`/courses/${item.id}`)}
                onBookmarkPress={() => void toggleBookmark(item.id)}
              />
            </View>
          )}
        />
      ) : null}
    </SafeAreaView>
  );
}
