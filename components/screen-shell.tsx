import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ScreenShell({ children, className }: ViewProps & { className?: string }) {
  return (
    <SafeAreaView className="flex-1 bg-ink">
      <View className={`flex-1 px-5 ${className ?? ""}`}>{children}</View>
    </SafeAreaView>
  );
}
