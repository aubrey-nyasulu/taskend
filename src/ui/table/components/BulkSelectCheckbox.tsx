import TaskContext from "@/context/TaskProvider"
import { useContext } from "react"

export function BulkSelectCheckbox({ id }: { id: string }) {
    const { setSelectedTasks, selectedTasks } = useContext(TaskContext)

    return (
        <input
            type="checkbox"
            className="pt-2"
            checked={selectedTasks.includes(id)}
            onChange={e => {
                if (e.target.checked) {
                    setSelectedTasks(prev => [...prev, id])
                } else {
                    setSelectedTasks(prev => prev.filter(taskId => taskId !== id))
                }
            }}
        />
    )
}