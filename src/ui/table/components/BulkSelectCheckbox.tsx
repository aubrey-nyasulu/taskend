import TaskContext from "@/context/TaskProvider"
import { useContext } from "react"

export function BulkSelectCheckbox({ id }: { id: string }) {
    const { setSelectedTasks, selectedTasks } = useContext(TaskContext)

    return (
        <label className="text-white ">
            <input
                type="checkbox"
                className="border-white-400/20 scale-100 transition-all duration-500 ease-in-out hover:scale-110 checked:scale-100 w-4 h-4 md:opacity-0 md:group-hover:opacity-100  md:checked:opacity-100 "
                checked={selectedTasks.includes(id)}
                onChange={e => {
                    if (e.target.checked) {
                        setSelectedTasks(prev => [...prev, id])
                    } else {
                        setSelectedTasks(prev => prev.filter(taskId => taskId !== id))
                    }
                }}
            />
        </label>
    )
}