import TaskContext from "@/context/TaskProvider"
import { FormEvent, useContext, useEffect, useRef, useState } from "react"

type EditableCellPropTypes = { fieldName: string, value: string, id: number }

export default function EditableCell({ id, value, fieldName }: EditableCellPropTypes) {
    const [inputValue, setInputValue] = useState('')

    const { editTask } = useContext(TaskContext)

    useEffect(() => {
        console.log('ed cell', { fieldName, value })
        setInputValue(value || '')
    }, [value])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('blur', function save() {
                editTask(id, fieldName, inputValue)

                this.removeEventListener('blur', save)
            })
        }
    }, [inputValue, id, fieldName, inputValue])

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
        >
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="focus:bg-stone-100 focus:shadow-md focus:pl-2 focus:rounded-lg focus:scale-110 h-full py-3 cursor-pointer focus:cursor-text"
            />
        </form>
    )
}