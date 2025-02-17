import ModalCloserBackground from "@/components/ModalCloserBackground";
import TaskManager from "@/components/TaskManager";

export default function TasksPage({ searchParams }: { searchParams: { page?: string } }) {


  return (
    <main className="h-screen w-[calc(100%_-340px)] flex flex-col items-center justify-between gap-10 min-h-screen px-4">
      <div className="w-full h-16 rounded-2xl mt-4">
        <div className="w-16 h-16 rounded-full bg-stone-200 float-right mr-4"></div>
      </div>

      <ModalCloserBackground />

      <TaskManager searchParams={searchParams} />
    </main>
  )
}
