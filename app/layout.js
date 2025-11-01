// app/layout.js
import "./globals.css";
import LayoutWithNav from "./components/LayoutWithNav";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "BuildMaster - Construction Pro",
  description: "Professional construction services and equipment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
      >
        {/* Client-only rendering wrapper to avoid hydration mismatch */}
        <ThemeProvider>
          <LayoutWithNav>{children}</LayoutWithNav>
        </ThemeProvider>
      </body>
    </html>
  );
}
