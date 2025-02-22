import TaskContext from "@/context/TaskProvider"
import { useEscape } from "@/customHooks/useEscape"
import { FormEvent, useContext, useEffect, useRef, useState } from "react"

type EditableCellPropTypes = { fieldName: string, value: string, id: number }

export default function EditableCell({ id, value, fieldName }: EditableCellPropTypes) {
    const [inputValue, setInputValue] = useState('')
    const [isEditing, setIsediting] = useState(false)

    useEscape(() => {
        inputRef.current?.blur()
        setIsediting(false)
    }, true)

    const { editTask } = useContext(TaskContext)

    useEffect(() => {
        setInputValue(value || '')
    }, [value])

    function save() {
        editTask(id, fieldName, inputValue)
    }

    const handleInputChange = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (inputRef.current) {
            inputRef.current.blur()
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <form
            onContextMenu={e => e.preventDefault()}
            onSubmit={handleInputChange}
            className="w-full min-w-[200px]"
        >
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                name={`cell-${id}`}
                id={`cell-${id}`}
                onChange={e => setInputValue(e.target.value)}
                onBlur={() => {
                    setIsediting(false)
                    save()
                }}
                onFocus={() => setIsediting(true)}
                className="focus:bg-stone-100 focus:shadow-md focus:pl-2 focus:rounded-lg focus:scale-110 h-full w-full py-3 px-3 cursor-pointer focus:cursor-text"
            />
        </form>
    )
}