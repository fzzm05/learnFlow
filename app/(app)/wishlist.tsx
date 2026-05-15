import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCourseStore } from "@/stores/course-store";
import { Skeleton } from "@/components/skeleton";
import { useInteractionReady } from "@/hooks/use-interaction-ready";

const WishlistSkeleton = () => (
  <View className="flex-1 px-4 mt-6 gap-4">
    {[1, 2, 3].map(i => (
      <View key={i} className="flex-row h-32 overflow-hidden rounded-xl border-[0.5px] border-border bg-surface p-3">
        <Skeleton className="h-full w-24 rounded-lg" />
        <View className="ml-4 flex-1">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
          <View className="mt-auto flex-row items-end gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md mb-0.5" />
          </View>
        </View>
      </View>
    ))}
  </View>
);

export default function WishlistScreen() {
  const router = useRouter();
  const courses = useCourseStore((state) => state.courses);
  const toggleBookmark = useCourseStore((state) => state.toggleBookmark);
  const enroll = useCourseStore((state) => state.enroll);
  const isReady = useInteractionReady();
  
  const wishlistCourses = courses.filter((c) => c.isBookmarked);

  if (wishlistCourses.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 pb-4">
          <Text className="text-[24px] font-bold text-primary">Wishlist</Text>
          <Pressable 
            onPress={() => router.push("/cart")}
            className="h-10 w-10 items-center justify-center"
          >
            <Feather name="shopping-cart" size={20} color="#EFEFEF" />
          </Pressable>
        </View>

        <View className="flex-1 items-center px-4 pt-10">
          <View className="mb-6 aspect-[1.1] w-full items-center justify-center rounded-[32px] bg-[#424242] overflow-hidden">
            <Image 
              source={require("../../assets/images/empty-wishlist-icon.png")} 
              className="h-full w-full" 
              resizeMode="cover" 
            />
          </View>
          
          <Text className="text-center text-[24px] font-bold text-primary">Your wishlist is empty</Text>
          <Text className="mt-3 px-2 text-center text-[14px] leading-6 text-secondary">
            Explore courses and save them here to keep track of what you want to learn next.
          </Text>
          
          <Pressable 
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            onPress={() => router.push("/(app)/")}
            className="active:opacity-80 mt-8 w-full rounded-lg bg-accent py-4"
          >
            <Text className="text-center text-[16px] font-semibold text-background">Explore Courses</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const totalItems = wishlistCourses.length;
  const totalPrice = wishlistCourses.reduce((sum, course) => sum + (course.price || 499), 0);

  const handleBuyAll = () => {
    wishlistCourses.forEach((c) => enroll(c.id));
  };

  const handleRemove = (id: string) => {
    toggleBookmark(id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 pb-4">
        <Text className="text-[24px] font-bold text-primary">Wishlist</Text>
        <Pressable 
          onPress={() => router.push("/cart")}
          className="h-10 w-10 items-center justify-center"
        >
          <Feather name="shopping-cart" size={20} color="#EFEFEF" />
        </Pressable>
      </View>

      {!isReady ? (
        <WishlistSkeleton />
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-6 gap-4 px-4">
          {wishlistCourses.map((course) => (
            <Pressable
              key={course.id}
              android_ripple={{ color: "rgba(255,255,255,0.1)" }}
              onPress={() => router.push(`/courses/${course.id}`)}
              className="active:opacity-80 flex-row h-32 overflow-hidden rounded-xl border-[0.5px] border-border bg-surface p-3"
            >
              <ExpoImage source={{ uri: course.thumbnail }} contentFit="cover" style={{ height: "100%", width: 96 }} className="rounded-lg bg-border" />
              <View className="ml-4 flex-1">
                <View className="flex-row items-start justify-between">
                  <Text className="flex-1 text-[15px] font-bold leading-5 text-primary" numberOfLines={2}>
                    {course.title}
                  </Text>
                  <Pressable onPress={() => handleRemove(course.id)} className="ml-2 p-1">
                    <Feather name="x" size={16} color="#EFEFEF" />
                  </Pressable>
                </View>
                
                <Text className="mt-1 text-[13px] text-secondary">{course.instructorName}</Text>
                
                <View className="mt-1 flex-row items-center">
                  <Text className="text-[12px] font-bold text-star">{course.rating}</Text>
                  <View className="ml-2 mr-2 flex-row gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star} 
                        name={star <= Math.round(course.rating) ? "star" : "star-outline"} 
                        size={10} 
                        color="#F59E0B" 
                      />
                    ))}
                  </View>
                  <Text className="text-[12px] text-secondary">(1.2k)</Text>
                </View>

                <View className="mt-auto flex-row items-end gap-2">
                  <Text className="text-[16px] font-bold text-primary">₹{course.price || 499}</Text>
                  <Text className="mb-0.5 text-[12px] text-secondary line-through">₹{(course.price || 499) + 500}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="flex-row items-center justify-between border-t-[0.5px] border-border bg-surface px-4 py-4 pb-6">
        <View>
          <Text className="text-[14px] text-secondary">Enroll in all for</Text>
          <Text className="text-[24px] font-bold text-accent">₹{totalPrice.toLocaleString()}</Text>
        </View>
        <Pressable android_ripple={{ color: "rgba(255,255,255,0.2)" }} onPress={handleBuyAll} className="active:opacity-80 rounded-lg bg-accent px-8 py-3">
          <Text className="text-[16px] font-semibold text-background">Buy All</Text>
          </Pressable>
        </View>
      </>
      )}
    </SafeAreaView>
  );
}
