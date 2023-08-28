import { CourseProvider } from "@/domains/Training/contexts/courseContext";
import "./styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pronunciation Checker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body suppressHydrationWarning={true}>
        <CourseProvider>{children}</CourseProvider>
      </body>
    </html>
  );
}
