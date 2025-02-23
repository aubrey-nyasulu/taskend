import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { UIContextProvider } from "@/context/UIProvider";
import { TaskContextProvider } from "@/context/TaskProvider";
import { BoardContextProvider } from "@/context/BoardContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task End",
  description: "A task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-stone-700 dark:text-stone-300 flex justify-center gap-4`}>
        <TaskContextProvider>
          <UIContextProvider>
            <BoardContextProvider>
              {children}
            </BoardContextProvider>
          </UIContextProvider>
        </TaskContextProvider>
      </body>
    </html>
  );
}
