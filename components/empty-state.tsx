import { Text, View } from "react-native";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="mt-16 rounded-[28px] border border-dashed border-white/10 bg-slate-900/60 px-6 py-10">
      <Text className="text-center text-xl font-semibold text-white">{title}</Text>
      <Text className="mt-3 text-center text-sm leading-6 text-slate-300">{description}</Text>
    </View>
  );
}
