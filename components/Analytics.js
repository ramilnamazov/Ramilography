import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";

// GA4 (gtag.js) is loaded in pages/_document.js so it sits in the raw <head>
// (needed for Google's tag detection). This component handles the Meta /
// Facebook Pixel only. It reads the ID from an env var and renders nothing
// until it's set, so it's safe to ship before the Pixel exists.
//   NEXT_PUBLIC_FB_PIXEL_ID  e.g. "1234567890123456"
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default function Analytics() {
  const router = useRouter();

  // Track client-side route changes (Next.js navigations don't reload the page,
  // so the Pixel needs to be told about each new URL manually).
  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    const handleRouteChange = () => {
      if (typeof window.fbq === "function") window.fbq("track", "PageView");
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  if (!FB_PIXEL_ID) return null;

  return (
    <Script id="fb-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
