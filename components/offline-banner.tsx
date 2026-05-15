import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export function OfflineBanner({ bottomInset = 0 }: { bottomInset?: number }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const subscription = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });

    return () => subscription();
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <View 
      className="absolute left-4 right-4 z-50 flex-row items-center justify-between rounded-xl bg-destructive p-4 shadow-lg shadow-black/50"
      style={{ bottom: bottomInset + 16 }}
    >
      <View className="flex-1">
        <Text className="text-[14px] font-bold text-white">No network connection</Text>
        <Text className="mt-1 text-[12px] text-white/90">
          Waiting for connection...
        </Text>
      </View>
      <Pressable 
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
        onPress={() => NetInfo.fetch()} 
        className="active:opacity-80 ml-4 rounded-lg bg-black/20 px-4 py-2"
      >
        <Text className="text-[12px] font-bold text-white">Try Again</Text>
      </Pressable>
    </View>
  );
}
