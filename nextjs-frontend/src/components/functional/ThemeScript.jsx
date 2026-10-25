export default function ThemeScript() {
  const script = `
    try {
      const stored = localStorage.getItem("ali-theme");

      if (stored) {
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch (e) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: script,
      }}
      // Add these for performance
      strategy="beforeInteractive"
      id="theme-script"
    />
  );
}