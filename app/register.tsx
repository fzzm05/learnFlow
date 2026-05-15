import { AntDesign } from "@expo/vector-icons";
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

const schema = z
  .object({
    fullName: z.string().min(2),
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type RegisterForm = z.infer<typeof schema>;

export default function RegisterScreen() {
  useProtectedRoute();

  useFocusEffect(
    useCallback(() => {
      useAuthStore.getState().clearAuthError();
    }, [])
  );

  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const authError = useAuthStore((state) => state.authError);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", username: "", email: "", password: "", confirmPassword: "" }
  });

  const onSubmit = handleSubmit(async (values) => {
    const success = await register({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      username: values.username
    });
    if (!success) return;

    // Register API doesn't return tokens — login immediately after to get a real session
    const loginSuccess = await useAuthStore.getState().login({
      email: values.email,
      password: values.password
    });
    if (!loginSuccess) return;

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
            {/* Doodle */}
            <View className="mx-auto h-48 w-full max-w-[240px] items-center justify-center">
              <ExpoImage
                source={require("../assets/images/signup-screen-image.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
              />
            </View>

            <Text className="mt-6 text-center text-[28px] font-bold text-primary">Create your account</Text>

            <View className="mt-10 gap-5">
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="FULL NAME"
                    placeholder="Jane Doe"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    error={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="EMAIL ADDRESS"
                    placeholder="jane@example.com"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="USERNAME"
                    placeholder="janedoe"
                    value={value}
                    onChangeText={onChange}
                    error={errors.username?.message}
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
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="CONFIRM PASSWORD"
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    error={errors.confirmPassword?.message}
                  />
                )}
              />
            </View>

            {authError ? <Text className="mt-4 text-center text-sm text-destructive">{authError}</Text> : null}

            <Pressable onPress={onSubmit} disabled={isSubmitting} className="mt-8 rounded-lg bg-[#2b4c44] py-4">
              <Text className="text-center text-[16px] font-semibold text-primary">
                {isSubmitting ? "Creating..." : "Create Account"}
              </Text>
            </Pressable>

            <Text className="mt-8 text-center text-[11px] leading-[18px] text-secondary">
              By creating an account, you agree to our Terms of Service{"\n"}and Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="mt-auto flex-row justify-center border-t-[0.5px] border-border bg-surface py-4">
        <Text className="text-[14px] text-secondary">Already have an account? </Text>
        <Link href="/login" asChild>
          <Pressable>
            <Text className="text-[14px] font-bold text-accent">Sign In</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
