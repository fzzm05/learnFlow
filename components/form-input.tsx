import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type FormInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
};

export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize = "none",
  error
}: FormInputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View className="gap-2">
      <Text className="text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary">{label}</Text>
      <View className="flex-row items-center rounded-xl border-[0.5px] border-border bg-background px-4">
        <TextInput
          className="flex-1 py-4 text-[14px] text-primary"
          placeholder={placeholder}
          placeholderTextColor="#8a8a8a"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          autoCapitalize={autoCapitalize}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setIsSecure(!isSecure)} className="ml-2 p-1">
            <Feather name={isSecure ? "eye" : "eye-off"} size={18} color="#8a8a8a" />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="text-xs text-destructive">{error}</Text> : null}
    </View>
  );
}
