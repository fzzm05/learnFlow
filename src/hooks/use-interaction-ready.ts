import { useState, useEffect } from "react";
import { InteractionManager } from "react-native";

export function useInteractionReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });

    return () => task.cancel();
  }, []);

  return isReady;
}
