import { AntDesign, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, InteractionManager, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { FormInput } from "@/components/form-input";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { ensureNotificationPermissions } from "@/lib/notifications";
import { useAuthStore } from "@/stores/auth-store";
import { usePreferencesStore } from "@/stores/preferences-store";

const schema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

type LoginForm = z.infer<typeof schema>;

export default function LoginScreen() {
  useProtectedRoute();

  useFocusEffect(
    useCallback(() => {
      useAuthStore.getState().clearAuthError();
    }, [])
  );

  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.authError);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = handleSubmit(async (values) => {
    const success = await login(values);
    if (!success) return;

    const preferencesStore = usePreferencesStore.getState();
    if (!preferencesStore.hasAskedNotificationPermission) {
      const granted = await ensureNotificationPermissions();
      await preferencesStore.setNotificationsEnabled(granted);
      await preferencesStore.markNotificationPermissionAsked();
    }

    InteractionManager.runAfterInteractions(() => {
      router.replace("/(app)");
    });
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-4 pt-10 pb-8">
        {/* Sign In Doodle */}
        <View className="mx-auto h-48 w-full max-w-[240px] items-center justify-center">
          <ExpoImage
            source={require("../assets/images/signin-screen-image.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
          />
        </View>

        <Text className="mt-6 text-center text-[28px] font-bold text-primary">Sign In to continue</Text>

        <View className="mt-10 gap-5">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="EMAIL"
                placeholder="name@example.com"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="PASSWORD"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />
        </View>

        {authError ? <Text className="mt-4 text-center text-sm text-destructive">{authError}</Text> : null}

        <Pressable onPress={onSubmit} disabled={isSubmitting} className="mt-8 rounded-lg bg-[#2b4c44] py-4">
          <Text className="text-center text-[16px] font-semibold text-primary">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Text>
        </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Pressable 
        onPress={() => router.replace("/onboarding")} 
        className="absolute left-6 top-8 z-50 h-12 w-12 items-start justify-center"
      >
        <AntDesign name="close" size={28} color="#EFEFEF" />
      </Pressable>

      <View className="mt-auto flex-row justify-center border-t-[0.5px] border-border bg-surface py-4">
        <Text className="text-[14px] text-secondary">Don't have an account? </Text>
        <Link href="/register" asChild>
          <Pressable>
            <Text className="text-[14px] font-bold text-accent">Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
