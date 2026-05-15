import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { useState, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useCourseStore } from "@/stores/course-store";

const whatYouWillLearn = [
  "Build complete, responsive design systems from scratch using Figma variables and auto-layout.",
  "Translate complex UI designs into fully functional, animated Webflow websites.",
  "Understand user psychology to create high-converting landing pages.",
  "Establish a freelance business, price your services, and land high-paying clients."
];

const curriculumData = [
  {
    title: "1. Introduction to UX Principles",
    lectures: "4 lectures • 24 min",
    items: [
      { type: "video", title: "What is UX Design?", duration: "04:20" },
      { type: "video", title: "The Double Diamond Process", duration: "08:15" },
      { type: "document", title: "UX Research Cheatsheet", duration: "2 pages" }
    ]
  },
  {
    title: "2. Mastering Figma Basics",
    lectures: "8 lectures • 1h 15m",
    items: [
      { type: "video", title: "Interface Overview", duration: "12:05" }
    ]
  },
  {
    title: "3. Advanced Auto Layout & Variables",
    lectures: "12 lectures • 2h 30m",
    items: []
  }
];

export default function CourseDetailsScreen() {
  useProtectedRoute();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const course = useCourseStore((state) => state.courses.find((item) => item.id === id));
  const instructor = useCourseStore((state) =>
    course ? state.instructors.find((item) => item.id === course.instructorId) : undefined
  );
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);
  const enroll = useCourseStore((state) => state.enroll);

  const [expandedSection, setExpandedSection] = useState<number>(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [pricingY, setPricingY] = useState(1000);

  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-background pt-4" edges={["top"]}>
        <EmptyState title="Course not found" description="This course may not be loaded yet. Go back and refresh the catalog." />
      </SafeAreaView>
    );
  }

  const handleAction = () => {
    // If not enrolled, enroll. Else, open content viewer.
    if (!course.isEnrolled) {
      void enroll(course.id);
    } else {
      router.push(`/courses/${course.id}/content`);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <View className="relative h-64 w-full bg-surface">
          {/* Blurred Background */}
          <ExpoImage 
            source={{ uri: course.heroImages[0] ?? course.thumbnail }} 
            contentFit="cover" 
            className="absolute inset-0 h-full w-full opacity-60" 
            blurRadius={10}
          />
          {/* Main Video Poster */}
          <ExpoImage 
            source={{ uri: course.heroImages[0] ?? course.thumbnail }} 
            contentFit="contain" 
            className="absolute inset-0 h-full w-full" 
          />
          
          {/* Top Overlays */}
          <SafeAreaView className="absolute left-0 right-0 top-0 flex-row justify-between px-4 pt-4" edges={["top"]}>
            <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-black/50">
              <Feather name="arrow-left" size={20} color="#EFEFEF" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/50">
              <Feather name="share-2" size={20} color="#EFEFEF" />
            </Pressable>
          </SafeAreaView>

          {/* Center Play Button */}
          <View className="absolute inset-0 items-center justify-center">
            <Pressable className="h-16 w-16 items-center justify-center rounded-full bg-accent/80">
              <Ionicons name="play" size={28} color="#191919" style={{ marginLeft: 4 }} />
            </Pressable>
          </View>

          {/* Bottom Badge */}
          <View className="absolute bottom-4 right-4 rounded bg-black/80 px-2 py-1">
            <Text className="text-[10px] font-bold text-primary">Preview</Text>
          </View>
        </View>

        {/* Info Section */}
        <View className="px-4 pt-5">
          <Text className="text-[24px] font-bold leading-8 text-primary">{course.title}</Text>
          <Text className="mt-3 text-[14px] leading-6 text-secondary">{course.description}</Text>

          <View className="mt-4 flex-row flex-wrap items-center gap-x-4 gap-y-2">
            <View className="rounded border-[0.5px] border-[#1f3f33] bg-[#142921] px-2 py-1">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-accent">Bestseller</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-[12px] font-bold text-star">{course.rating}</Text>
              <Ionicons name="star" size={12} color="#F59E0B" style={{ marginLeft: 2, marginRight: 4 }} />
              <Text className="text-[12px] text-accent underline">(12,450 ratings)</Text>
            </View>
            <Text className="text-[12px] text-secondary">84,012 students</Text>
          </View>

          <View className="mt-3 flex-row items-center gap-4">
            <View className="flex-row items-center">
              <Feather name="check-circle" size={12} color="#8a8a8a" />
              <Text className="ml-1 text-[12px] text-secondary">Updated Nov 2024</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="globe" size={12} color="#8a8a8a" />
              <Text className="ml-1 text-[12px] text-secondary">English, Spanish +2</Text>
            </View>
          </View>

          <Pressable 
            className="mt-4 flex-row items-center"
            onPress={() => router.push(`/(app)/instructor/${instructor?.id ?? course.instructorId}`)}
          >
            {instructor?.avatar ? (
              <ExpoImage source={{ uri: instructor.avatar }} className="h-6 w-6 rounded-full" />
            ) : (
              <View className="h-6 w-6 items-center justify-center rounded-full bg-surface">
                <Text className="text-[10px] font-bold text-primary">{course.instructorName.charAt(0)}</Text>
              </View>
            )}
            <Text className="ml-2 text-[12px] text-secondary">
              Created by <Text className="font-semibold text-accent">{instructor?.name ?? course.instructorName}</Text>
            </Text>
          </Pressable>

          {/* Pricing & Buttons Wrapper */}
          <View onLayout={(e) => setPricingY(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
            {/* Pricing */}
            <View className="mt-8">
              <View className="flex-row items-end gap-3">
                <Text className="text-[28px] font-bold text-primary">₹{course.price}</Text>
                <Text className="mb-1 text-[14px] text-secondary line-through">₹3,499</Text>
                <Text className="mb-1 text-[14px] font-semibold text-accent">87% off</Text>
              </View>
              <View className="mt-1 flex-row items-center">
                <Feather name="clock" size={12} color="#f87171" />
                <Text className="ml-1 text-[12px] font-medium text-red-400">14 hours left at this price!</Text>
              </View>
            </View>

            {/* Buttons */}
            <View className="mt-6 gap-3">
              <Pressable onPress={handleAction} className="rounded-lg bg-accent py-4">
                <Text className="text-center text-[16px] font-semibold text-background">
                  {course.isEnrolled ? "Continue Learning" : "Buy Now"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => void toggleBookmark(course.id)}
                className={`flex-row items-center justify-center rounded-lg border-[0.5px] py-4 ${course.isBookmarked ? "border-accent/40 bg-[#142921]" : "border-border bg-surface"}`}
              >
                {course.isBookmarked
                  ? <Ionicons name="heart" size={18} color="#95D1BD" />
                  : <Feather name="heart" size={18} color="#EFEFEF" />
                }
                <Text className={`ml-2 text-[16px] font-semibold ${course.isBookmarked ? "text-accent" : "text-primary"}`}>
                  {course.isBookmarked ? "Saved to Wishlist" : "Add to Wishlist"}
                </Text>
              </Pressable>
              <Text className="mt-1 text-center text-[10px] text-secondary">30-Day Money-Back Guarantee</Text>
            </View>
          </View>

          {/* What you'll learn */}
          <View className="mt-8 rounded-xl border-[0.5px] border-border bg-surface p-5">
            <Text className="mb-4 text-[18px] font-bold text-primary">What you'll learn</Text>
            <View className="gap-3">
              {whatYouWillLearn.map((point, index) => (
                <View key={index} className="flex-row items-start">
                  <Feather name="check" size={16} color="#95D1BD" style={{ marginTop: 2 }} />
                  <Text className="ml-3 flex-1 text-[13px] leading-5 text-secondary">{point}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Curriculum */}
          <View className="mt-8">
            <Text className="text-[20px] font-bold text-primary">Curriculum</Text>
            <Text className="mt-1 text-[12px] text-secondary">14 sections • 150 lectures • 16h 24m total length</Text>

            <View className="mt-4 gap-3">
              {curriculumData.map((section, index) => {
                const isExpanded = expandedSection === index;
                return (
                  <View key={index} className="overflow-hidden rounded-xl border-[0.5px] border-border bg-surface">
                    <Pressable onPress={() => setExpandedSection(isExpanded ? -1 : index)} className="flex-row items-center justify-between p-4">
                      <View className="flex-1 pr-4">
                        <Text className="text-[14px] font-bold text-primary">{section.title}</Text>
                        <Text className="mt-1 text-[11px] text-secondary">{section.lectures}</Text>
                      </View>
                      <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#EFEFEF" />
                    </Pressable>
                    {isExpanded && section.items.length > 0 ? (
                      <View className="border-t-[0.5px] border-border">
                        {section.items.map((item, i) => (
                          <View key={i} className="flex-row items-center justify-between px-4 py-3">
                            <View className="flex-row items-center flex-1 pr-4">
                              <Feather name={item.type === "video" ? "play-circle" : "file-text"} size={16} color="#EFEFEF" />
                              <Text className="ml-3 flex-1 text-[13px] text-primary">{item.title}</Text>
                            </View>
                            <Text className="text-[11px] text-secondary">{item.duration}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>

            <Pressable className="mt-4 items-center justify-center rounded-lg border-[0.5px] border-border bg-transparent py-4">
              <Text className="text-[15px] font-bold text-primary">Show all 14 sections</Text>
            </Pressable>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Bar */}
      <Animated.View 
        style={{ 
          transform: [{ 
            translateY: scrollY.interpolate({
              inputRange: [-1, pricingY, pricingY + 50],
              outputRange: [150, 150, 0],
              extrapolate: "clamp"
            }) 
          }]
        }}
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-[0.5px] border-border bg-background px-4 py-4 pb-6"
      >
        <View>
          <View className="flex-row items-end gap-2">
            <Text className="text-[20px] font-bold text-primary">₹{course.price}</Text>
            <Text className="mb-0.5 text-[12px] text-secondary line-through">₹3,499</Text>
          </View>
          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-[10px] font-semibold text-accent">87% off</Text>
          </View>
        </View>
        <Pressable onPress={handleAction} className="w-1/2 items-center justify-center rounded-lg bg-accent py-3">
          <Text className="text-[16px] font-semibold text-background">
            {course.isEnrolled ? "Continue" : "Buy Now"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
