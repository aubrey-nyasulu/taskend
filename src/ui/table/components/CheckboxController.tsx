import { PartialSelection } from "@/assets/svgAssets"
import TaskContext from "@/context/TaskProvider"
import clsx from "clsx"
import { useContext } from "react"

export default function CheckboxController() {
    const { selectedTasks, setSelectedTasks, rows } = useContext(TaskContext)

    return (
        <>
            {
                selectedTasks.length > 0
                    ? <label
                        className="text-white"
                        htmlFor="masterSelector"
                    >
                        {
                            selectedTasks.length < 20 &&
                            <PartialSelection />
                        }
                        <input
                            type="checkbox"
                            id="masterSelector"
                            className={clsx(
                                "border-white-400 /20 :scale-100 transition-all duration-500 ease-in-out hover:scale-110 checked:scale-100 w-4 h-4",
                                {
                                    "absolute top-4 opacity-0 z-50": selectedTasks.length < 20
                                }
                            )}
                            checked={selectedTasks.length === 20}
                            onChange={e => {
                                if (e.target.checked) {
                                    setSelectedTasks(rows.map(({ id }) => id.toString()))
                                } else {
                                    setSelectedTasks([])
                                }
                            }}
                        />
                    </label>
                    : null
            }
        </>
    )
}