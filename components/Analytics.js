import { useRouter } from "next/router";
import { useEffect } from "react";

// The GA4 and Meta Pixel base tags live in pages/_document.js (in <head>) so
// they're in the raw HTML and detectable by Google/Meta tooling. This component
// only handles the Meta Pixel's client-side route changes — Next.js navigations
// don't reload the page, so the Pixel must be told about each new URL. (GA4's
// enhanced measurement tracks SPA page changes on its own.)
export default function Analytics() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window.fbq === "function") window.fbq("track", "PageView");
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return null;
}
