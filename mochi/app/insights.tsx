import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function InsightsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/memories" as any);
  }, []);

  return null;
}
