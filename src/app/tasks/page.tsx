import ModalCloserBackground from "@/components/ModalCloserBackground";
import TaskManager from "@/components/TaskManager";

export type TaskPageSearchParams = {
  searchParams: {
    page?: string
    sort?: string
    order?: string
    filter?: string
    filterConstraint?: 'contains' | 'does not contain' | 'starts with' | 'ends with'
  }
}

export default function TasksPage({ searchParams }: TaskPageSearchParams) {

  return (
    <main className="h-screen w-full md:w-[calc(100%_-340px)] flex flex-col items-center justify-between gap-10 min-h-screen md:px-4">
      <div className="w-full h-16 rounded-2xl mt-4">
        <div className="w-16 h-16 rounded-full bg-stone-200 float-right mr-4"></div>
      </div>

      <ModalCloserBackground />

      <TaskManager searchParams={searchParams} />
    </main>
  )
}
