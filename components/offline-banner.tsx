import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Banner } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isOffline) return null;

  return (
    <SafeAreaView>
      <Banner
        visible={true}
        actions={[]}
        icon="wifi-off"
        accessibilityLabel="Offline banner"
      >
        You are currently offline, so some features may be unavailable.
      </Banner>
    </SafeAreaView>
  );
}
