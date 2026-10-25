"use client"; 
import { useEffect } from "react"; 

const AOSProvider = () => {
  useEffect(() => { 
    import("aos").then((AOS) => {
      import("aos/dist/aos.css");

      // Delay init until after hydration completes
      // requestAnimationFrame ensures React has finished hydrating
      requestAnimationFrame(() => {
        AOS.default.init({
          duration: 700,
          once: false,
          offset: 40,
          easing: "ease-out-cubic",
          disable: () =>
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
      });
    });
  }, []);

  return null;
}

export default AOSProvider
