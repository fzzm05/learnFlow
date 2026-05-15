import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, FlatList, useWindowDimensions } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_SLIDES = [
  {
    image: require("../assets/images/onboarding-screen-image1.png"),
    title: "Learn from the Best",
    description: "Access world-class courses taught by industry experts and experienced professionals."
  },
  {
    image: require("../assets/images/onboarding-screen-image2.png"),
    title: "Learn Anywhere",
    description: "Download courses for offline viewing and learn at your own pace, wherever you are."
  },
  {
    image: require("../assets/images/onboarding-screen-image3.png"),
    title: "Achieve Your Goals",
    description: "Earn certificates, build your portfolio, and take the next step in your career journey."
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % ONBOARDING_SLIDES.length;
        flatListRef.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPlay, width]);

  const onMomentumScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_SLIDES[0] }) => (
    <View style={{ width }} className="items-center justify-center px-4 pt-10 pb-6">
      <View className="aspect-square w-full max-w-[340px] items-center justify-center rounded-xl overflow-hidden">
        <ExpoImage
          source={item.image}
          contentFit="cover"
          transition={300}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View className="mt-10 items-center px-2 min-h-[100px]">
        <Text className="text-center text-[26px] font-bold text-primary">
          {item.title}
        </Text>
        <Text className="mt-3 text-center text-[15px] leading-6 text-secondary">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScrollBeginDrag={() => setAutoPlay(false)}
          onMomentumScrollEnd={onMomentumScrollEnd}
          keyExtractor={(_, index) => index.toString()}
        />

        {/* Carousel Dots */}
        <View className="mb-10 flex-row items-center justify-center gap-2">
          {ONBOARDING_SLIDES.map((_, index) => (
            <View 
              key={index} 
              className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-accent" : "bg-border"}`} 
            />
          ))}
        </View>
      </View>

      {/* Bottom Bar Controls */}
      <View className="flex-row items-stretch bg-[#2b4c44]">
        <Link href="/login" asChild>
          <Pressable className="flex-1 items-center justify-center py-6">
            <Text className="text-[15px] font-semibold text-primary">Sign In</Text>
          </Pressable>
        </Link>
        <Link href="/register" asChild>
          <Pressable className="flex-1 items-center justify-center py-6">
            <Text className="text-[15px] font-semibold text-primary">Get Started</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
