import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePreferencesStore } from "@/stores/preferences-store";

export default function QuizScreen() {
  const router = useRouter();
  const setOnboardingComplete = usePreferencesStore((state) => state.setOnboardingComplete);
  const [selected, setSelected] = useState<string>("programming");

  async function handleComplete() {
    await setOnboardingComplete();
    router.replace("/(app)");
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={24} color="#EFEFEF" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">Step 1 of 3</Text>
        <Pressable onPress={handleComplete} className="p-1">
          <Text className="text-[15px] font-medium text-accent">Skip</Text>
        </Pressable>
      </View>

      {/* Progress Bar */}
      <View className="h-1 w-full flex-row bg-border">
        <View className="h-full w-1/3 bg-accent" />
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-8">
        <Text className="text-center text-[28px] font-bold text-primary">What do you want to learn?</Text>
        <Text className="mt-4 px-2 text-center text-[15px] leading-6 text-secondary">
          Select the topics you're most interested in to personalize your feed.
        </Text>

        {/* Grid */}
        <View className="mt-10 flex-row flex-wrap justify-between gap-y-4">
          <QuizOption
            title="Programming"
            icon={<Feather name="code" size={28} color={selected === "programming" ? "#95D1BD" : "#EFEFEF"} />}
            isSelected={selected === "programming"}
            onPress={() => setSelected("programming")}
          />
          <QuizOption
            title="Design"
            icon={<Ionicons name="brush" size={28} color={selected === "design" ? "#95D1BD" : "#EFEFEF"} />}
            isSelected={selected === "design"}
            onPress={() => setSelected("design")}
          />
          <QuizOption
            title="Business"
            icon={<Feather name="trending-up" size={28} color={selected === "business" ? "#95D1BD" : "#EFEFEF"} />}
            isSelected={selected === "business"}
            onPress={() => setSelected("business")}
          />
          <QuizOption
            title="Personal Growth"
            icon={<MaterialCommunityIcons name="meditation" size={28} color={selected === "growth" ? "#95D1BD" : "#EFEFEF"} />}
            isSelected={selected === "growth"}
            onPress={() => setSelected("growth")}
          />
        </View>
      </View>

      {/* Bottom Bar */}
      <View className="border-t border-border bg-background px-4 py-4 pb-6">
        <Pressable onPress={handleComplete} className="flex-row items-center justify-center rounded-lg bg-accent py-4">
          <Text className="text-[16px] font-semibold text-background">Continue</Text>
          <Feather name="arrow-right" size={20} color="#191919" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function QuizOption({
  title,
  icon,
  isSelected,
  onPress
}: {
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`relative w-[48%] items-center justify-center rounded-[16px] border-[0.5px] p-6 ${
        isSelected ? "border-accent bg-accent/10" : "border-border bg-surface"
      }`}
      style={{ aspectRatio: 1.2 }}
    >
      {isSelected ? (
        <View className="absolute right-3 top-3">
          <Feather name="check-circle" size={16} color="#95D1BD" />
        </View>
      ) : null}
      {icon}
      <Text className={`mt-4 text-[14px] font-medium ${isSelected ? "text-accent" : "text-primary"}`}>{title}</Text>
    </Pressable>
  );
}
