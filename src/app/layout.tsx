import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import TemporaryButton from "@/components/TemporaryButton";
import { UIContextProvider } from "@/context/UIProvider";
import AddNewFieldModal from "@/components/AddNewFieldModal";
import { TaskContextProvider } from "@/context/TaskProvider";

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
      <body className={`${inter.className} text-stone-950 dark:text-stone-300 flex gap-4`}>
        <TaskContextProvider>
          <header className="w-[340px] h-svh">
            <nav className="h-full flex flex-col justify-between">
              <Link href={'/tasks'}>taks</Link>

              <TemporaryButton />
            </nav>
          </header>

          {children}

          {/* <AddNewFieldModal /> */}
        </TaskContextProvider>
      </body>
    </html>
  );
}
