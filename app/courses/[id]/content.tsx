import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { buildCourseHtml } from "@/features/courses/course-utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCourseStore } from "@/stores/course-store";

export default function CourseContentScreen() {
  useProtectedRoute();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const course = useCourseStore((state) => state.courses.find((item) => item.id === id));
  const token = useAuthStore((state) => state.accessToken);
  const [error, setError] = useState<string | null>(null);
  const [bridgeMessage, setBridgeMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const html = useMemo(() => (course ? buildCourseHtml(course) : ""), [course]);

  const handleLoadProgress = ({ nativeEvent }: any) => {
    const progress = nativeEvent.progress;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    if (progress === 1) {
      setTimeout(() => setLoading(false), 500);
    } else {
      setLoading(true);
    }
  };

  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="px-4 pt-4">
          <EmptyState title="Content unavailable" description="This course is missing from local state. Return to the catalog and retry." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center gap-4 px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <Feather name="arrow-left" size={20} color="#EFEFEF" />
        </Pressable>
        <Text className="text-[20px] font-bold text-primary">Continue Learning</Text>
      </View>

      <View className="flex-1 px-4 pt-2">
        {/* Info Card */}
        <View className="mb-4 rounded-xl border-[0.5px] border-border bg-surface p-4">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-accent" />
            <Text className="text-[16px] font-bold text-primary" numberOfLines={1}>
              {course.title}
            </Text>
          </View>
          <Text className="mt-2 text-[13px] leading-5 text-secondary">
            The content for this course would be rendered here in WebView.
          </Text>
          {bridgeMessage ? (
            <View className="mt-3 flex-row items-center gap-2 rounded-lg bg-[#142921] px-3 py-2">
              <Feather name="message-square" size={12} color="#95D1BD" />
              <Text className="text-[11px] font-medium text-accent">{bridgeMessage}</Text>
            </View>
          ) : null}
        </View>

        {error ? (
          <View className="mb-4 rounded-xl border-[0.5px] border-red-500/30 bg-red-500/10 p-4">
            <View className="flex-row items-center gap-2">
              <Feather name="alert-circle" size={16} color="#f87171" />
              <Text className="font-semibold text-red-400">Load Failure</Text>
            </View>
            <Text className="mt-1 text-[13px] text-red-200">{error}</Text>
            <Pressable
              onPress={() => {
                setError(null);
                setReloadKey((value) => value + 1);
                progressAnim.setValue(0);
              }}
              className="mt-3 items-center rounded-lg bg-red-500/20 py-2.5 border-[0.5px] border-red-500/30"
            >
              <Text className="font-bold text-red-400">Retry Connection</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="flex-1 overflow-hidden rounded-2xl border-[0.5px] border-border bg-surface shadow-2xl relative">
          {/* Loading Bar */}
          {loading && (
            <View className="absolute top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
              <Animated.View 
                className="h-full bg-accent"
                style={{
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"]
                  })
                }}
              />
            </View>
          )}

          <WebView
            key={reloadKey}
            source={{ html }}
            originWhitelist={["*"]}
            onLoadProgress={handleLoadProgress}
            onMessage={(event) => setBridgeMessage(`Event: ${event.nativeEvent.data}`)}
            onError={() => setError("The embedded content failed to load.")}
            className="flex-1"
          />
        </View>
        <Text className="my-4 text-center text-[10px] tracking-widest text-secondary uppercase">
          Secured Learning Session
        </Text>
      </View>
    </SafeAreaView>
  );
}
