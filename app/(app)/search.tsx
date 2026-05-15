import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";

import { CourseCard } from "@/components/course-card";
import { Skeleton } from "@/components/skeleton";
import { useInteractionReady } from "@/hooks/use-interaction-ready";
import { useCourseStore } from "@/stores/course-store";

const SearchSkeleton = () => (
  <View className="flex-1 px-4 mt-6">
    <Skeleton className="mb-4 h-6 w-32 rounded-md" />
    <View className="mb-8 flex-row flex-wrap gap-3">
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-10 w-32 rounded-full" />
      <Skeleton className="h-10 w-20 rounded-full" />
      <Skeleton className="h-10 w-28 rounded-full" />
    </View>
    <Skeleton className="mb-4 h-6 w-40 rounded-md" />
    <View className="flex-row flex-wrap justify-between gap-y-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="w-[48%] h-28 rounded-[12px]" />
      ))}
    </View>
  </View>
);

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const isReady = useInteractionReady();
  const courses = useCourseStore((state) => state.courses);
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.instructorName.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  const topSearches = ["React Native", "Python", "UI/UX", "Data Science", "Node.js", "Machine Learning"];

  const categories = [
    { title: "Development", icon: <Feather name="code" size={24} color="#95D1BD" /> },
    { title: "Design", icon: <Ionicons name="brush" size={24} color="#F59E0B" /> },
    { title: "Business", icon: <Feather name="briefcase" size={24} color="#ec4899" /> },
    { title: "Marketing", icon: <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#95D1BD" /> },
    { title: "Photography", icon: <Feather name="camera" size={24} color="#F59E0B" /> },
    { title: "Music", icon: <Feather name="music" size={24} color="#ec4899" /> }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[24px] font-bold text-primary">Search</Text>
          <Pressable 
            onPress={() => router.push("/cart")}
            className="h-10 w-10 items-center justify-center"
          >
            <Feather name="shopping-cart" size={20} color="#EFEFEF" />
          </Pressable>
        </View>
        <View className="flex-row items-center">
          <View className="flex-1 flex-row items-center rounded-lg border-[0.5px] border-accent px-3 py-2.5">
            <Feather name="search" size={18} color="#8a8a8a" />
            <TextInput
              className="ml-2 flex-1 text-[15px] text-primary"
              placeholder="Search courses, instructors..."
              placeholderTextColor="#8a8a8a"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable className="ml-4">
            <Ionicons name="options-outline" size={24} color="#EFEFEF" />
          </Pressable>
        </View>
      </View>

      {!isReady ? (
        <SearchSkeleton />
      ) : searchQuery.trim() ? (
        <View className="flex-1">
          {filteredCourses.length > 0 ? (
            <LegendList
              data={filteredCourses}
              keyExtractor={(item) => item.id}
              estimatedItemSize={120}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
              renderItem={({ item }) => (
                <CourseCard
                  course={item}
                  onPress={() => router.push(`/courses/${item.id}`)}
                  onBookmarkPress={() => void toggleBookmark(item.id)}
                />
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center px-4 pt-20">
              <Feather name="search" size={64} color="#333333" />
              <Text className="mt-4 text-[18px] font-bold text-primary">No results found</Text>
              <Text className="mt-2 text-center text-secondary">
                We couldn't find any courses matching "{searchQuery}"
              </Text>
            </View>
          )}
        </View>
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Top Searches */}
          <View className="mt-6">
            <Text className="text-[20px] font-bold text-primary">Top Searches</Text>
            <View className="mt-4 flex-row flex-wrap gap-3">
              {topSearches.map((term) => (
                <Pressable
                  key={term}
                  onPress={() => setSearchQuery(term)}
                  android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                  className="active:opacity-80 rounded-full border-[0.5px] border-border bg-surface px-4 py-2"
                >
                  <Text className="text-[14px] text-primary">{term}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Browse Categories */}
          <View className="mt-8 pb-32">
            <Text className="text-[20px] font-bold text-primary">Browse Categories</Text>
            <View className="mt-4 flex-row flex-wrap justify-between gap-y-4">
              {categories.map((cat) => (
                <Pressable
                  key={cat.title}
                  onPress={() => setSearchQuery(cat.title)}
                  android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                  className="active:opacity-80 w-[48%] items-center justify-center rounded-[12px] border-[0.5px] border-border bg-surface py-8"
                >
                  {cat.icon}
                  <Text className="mt-3 text-[14px] text-primary">{cat.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
