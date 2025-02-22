import TaskManager from "@/ui/TaskManager";

export type TaskPageSearchParams = {
  searchParams: {
    page?: string
    sort?: string
    order?: 'a' | 'd'
    filter?: string
    filterConstraint?: 'contains' | 'does not contain' | 'starts with' | 'ends with'
  }
}

export default function TasksPage({ searchParams }: TaskPageSearchParams) {

  return (
    <main className="h-screen w-full md:w-[calc(100%_-340px)] flex items-end  md:px-4">
      <TaskManager searchParams={searchParams} />
    </main>
  )
}
