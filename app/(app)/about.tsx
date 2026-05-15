import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const router = useRouter();

  const links = [
    { title: "Terms of Use" },
    { title: "Privacy Policy" },
    { title: "Intellectual Property" },
    { title: "Licenses" }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center border-b-[0.5px] border-border px-4 py-3 pb-4">
        <Pressable onPress={() => router.back()} className="p-1 mr-4">
          <Feather name="arrow-left" size={24} color="#EFEFEF" />
        </Pressable>
        <Text className="text-[20px] font-bold text-primary">About LearnFlow</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center px-4 pt-12 pb-8">
          {/* Logo Box */}
          <View className="h-24 w-24 items-center justify-center rounded-2xl border-[0.5px] border-border bg-[#2A2A2A]">
            <Feather name="book-open" size={40} color="#95D1BD" />
          </View>

          <Text className="mt-6 text-[32px] font-bold text-accent">LearnFlow</Text>
          <Text className="mt-2 text-[14px] text-secondary">Version 1.0.0 (Build 402)</Text>
          
          <Text className="mt-6 px-4 text-center text-[16px] leading-6 text-primary">
            Empowering learners worldwide to achieve their goals.
          </Text>
        </View>

        {/* Links List */}
        <View className="px-4">
          <View className="rounded-xl border-[0.5px] border-border bg-surface">
            {links.map((link, idx) => (
              <Pressable 
                key={idx} 
                className={`flex-row items-center justify-between p-4 ${idx !== links.length - 1 ? "border-b-[0.5px] border-border" : ""}`}
              >
                <Text className="text-[15px] text-primary">{link.title}</Text>
                <Feather name="chevron-right" size={18} color="#8a8a8a" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="mt-20 items-center px-4">
          <View className="flex-row gap-6 mb-8">
            <Pressable className="h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-border bg-surface">
              <Feather name="twitter" size={20} color="#EFEFEF" />
            </Pressable>
            <Pressable className="h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-border bg-surface">
              <Feather name="linkedin" size={20} color="#EFEFEF" />
            </Pressable>
            <Pressable className="h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-border bg-surface">
              <Feather name="github" size={20} color="#EFEFEF" />
            </Pressable>
          </View>
          <Text className="text-[12px] text-secondary tracking-widest">© 2025 LearnFlow Inc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
