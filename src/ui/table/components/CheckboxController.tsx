import TaskContext from "@/context/TaskProvider"
import { useContext } from "react"

export default function CheckboxController() {
    const { setSelectedTasks, rows } = useContext(TaskContext)

    return (
        <input
            type="checkbox"
            className="pt-2"
            onChange={e => {
                if (e.target.checked) {
                    setSelectedTasks(rows.map(({ id }) => id.toString()))
                } else {
                    setSelectedTasks([])
                }
            }}
        />
    )
}