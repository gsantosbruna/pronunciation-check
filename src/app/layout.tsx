import { CourseProvider } from "@/domains/Training/contexts/courseContext";
import "./styles/globals.css";
import type { Metadata } from "next";
import Favicon from "/public/favicon.ico";

export const metadata: Metadata = {
  title: "Pronunciation Checker",
  description:
    "Pronunciation training web app using Google Speech Recognition API",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <CourseProvider>{children}</CourseProvider>
      </body>
    </html>
  );
}
