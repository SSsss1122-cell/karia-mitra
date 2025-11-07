// app/layout.js
import "./globals.css";
import LayoutWithNav from "./components/LayoutWithNav";
import { ThemeProvider } from "./context/ThemeContext";
import VersionChecker from "./components/VersionChecker";

export const metadata = {
  title: "BuildMaster - Construction Pro",
  description: "Professional construction services and equipment",
};

// App version - har update ke saath isko badhana hoga
const APP_VERSION = '1.0.1';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-version={APP_VERSION}>
      <head>
        {/* Cache control ke liye meta tags - CORRECTED */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        suppressHydrationWarning
        className="transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
      >
        {/* Client-only rendering wrapper to avoid hydration mismatch */}
        <ThemeProvider>
          <VersionChecker />
          <LayoutWithNav>{children}</LayoutWithNav>
        </ThemeProvider>
        
        {/* App version ko window object mein store karo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.APP_VERSION = '${APP_VERSION}';
              console.log('App Version:', '${APP_VERSION}');
            `,
          }}
        />
      </body>
    </html>
  );
}