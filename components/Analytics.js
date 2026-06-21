import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";

// IDs are read from environment variables so they can be added later in Vercel
// (Settings → Environment Variables) without any code change. Until they exist,
// this component renders nothing and no tracking runs.
//   NEXT_PUBLIC_GA_ID        e.g. "G-XXXXXXXXXX"  (Google Analytics 4)
//   NEXT_PUBLIC_FB_PIXEL_ID  e.g. "1234567890"    (Meta / Facebook Pixel)
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-1YVMF8B92E";
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default function Analytics() {
  const router = useRouter();

  // Track client-side route changes (Next.js navigations don't reload the page,
  // so each analytics tool needs to be told about the new URL manually).
  useEffect(() => {
    if (!GA_ID && !FB_PIXEL_ID) return;

    const handleRouteChange = (url) => {
      if (GA_ID && typeof window.gtag === "function") {
        window.gtag("config", GA_ID, { page_path: url });
      }
      if (FB_PIXEL_ID && typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  if (!GA_ID && !FB_PIXEL_ID) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {FB_PIXEL_ID && (
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
      )}
    </>
  );
}
