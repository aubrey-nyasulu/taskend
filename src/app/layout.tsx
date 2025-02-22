import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import TemporaryButton from "@/ui/components/TemporaryButton";
import { UIContextProvider } from "@/context/UIProvider";
import { TaskContextProvider } from "@/context/TaskProvider";
import CreateTaskButton from "@/ui/table/components/CreateTaskButton";
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
      <body className={`${inter.className} text-stone-950 dark:text-stone-300 flex gap-4`}>
        <TaskContextProvider>
          <UIContextProvider>
            <BoardContextProvider>

              <header className="w-[340px] h-svh fixed left-0 top-0 hidden md:block">
                <nav className="h-full flex flex-col justify-between">
                  <Link href={'/tasks'}>taks</Link>

                  <TemporaryButton />
                </nav>
              </header>

              <div className="w-[340px] h-svh hidden md:block"></div>

              {children}

              <CreateTaskButton />
            </BoardContextProvider>
          </UIContextProvider>
        </TaskContextProvider>
      </body>
    </html>
  );
}
