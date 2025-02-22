import SearchSortAndFilter from "@/ui/components/SearchSortAndFilter";
import TaskManager, { TableBoardToggle } from "@/ui/TaskManager";

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
    <main className="h-screen overflow-hidden w-full md:w-[calc(100%_-340px)] flex flex-col items-end justify-between pt-2 md:px-4">
      <SearchSortAndFilter />

      <TaskManager searchParams={searchParams} />
    </main>
  )
}
