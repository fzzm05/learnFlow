import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";

import type { Course } from "@/types/models";

type CourseCardProps = {
  course: Course;
  onPress: () => void;
  onBookmarkPress: () => void;
};

function CourseCardComponent({ course, onPress, onBookmarkPress }: CourseCardProps) {
  return (
    <Pressable android_ripple={{ color: "rgba(255,255,255,0.1)" }} onPress={onPress} className="active:opacity-80 mb-4 flex-row overflow-hidden rounded-[12px] border-[0.5px] border-border bg-surface h-28">
      <Image source={{ uri: course.thumbnail }} contentFit="cover" style={{ height: "100%", width: 112 }} className="bg-border" />
      <View className="flex-1 p-3 justify-between">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 text-[15px] font-semibold text-primary pr-2" numberOfLines={1}>{course.title}</Text>
          <Pressable
            onPress={(e) => { e.stopPropagation(); onBookmarkPress(); }}
            hitSlop={8}
            className="mt-0.5"
          >
            {course.isBookmarked
              ? <Ionicons name="heart" size={18} color="#95D1BD" />
              : <Feather name="heart" size={18} color="#8a8a8a" />
            }
          </Pressable>
        </View>
        <Text className="text-[12px] text-secondary">{course.instructorName}</Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text className="ml-1 text-[12px] font-medium text-star">{course.rating}</Text>
          </View>
          <View className="flex-row items-baseline gap-2">
            <Text className="text-[12px] text-secondary line-through">${(course.price * 4.5).toFixed(0)}</Text>
            <Text className="text-[15px] font-bold text-primary">${course.price}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export const CourseCard = memo(CourseCardComponent);

