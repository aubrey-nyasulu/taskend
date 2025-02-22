import { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import TaskContext from "@/context/TaskProvider"
import UIContext from "@/context/UIProvider"
import { RowType } from "@/types"
import ModalCloserBackground from "./ModalCloserBackground"
import { useEscape } from "@/customHooks/useEscape"
import BoardContext from "@/context/BoardContextProvider"

type CreateTaskModalProps = {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
}

export default function CreateTaskModal({ isOpen, setIsOpen }: CreateTaskModalProps) {
  const { fetchColumns } = useContext(BoardContext)
  const { columns, createTask, editTask } = useContext(TaskContext)
  const { activeTask, setActiveTask } = useContext(UIContext)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEscape(() => setIsOpen(false), isOpen)

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset()
    }
  }, [isOpen])

  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries()) as RowType

    if (activeTask) {
      if (data.title !== activeTask.title) editTask(activeTask.id, 'title', data.title)
      if (data.status !== activeTask.status) editTask(activeTask.id, 'status', data.status)
      if (data.priority !== activeTask.priority) editTask(activeTask.id, 'priority', data.priority)

      fetchColumns()
    } else {
      createTask(data)
    }

    formRef.current?.reset()
    setIsOpen(false)
    setActiveTask(undefined)
    router.push("/?page=1")
  }

  return (
    <>
      <ModalCloserBackground isOpen={isOpen} setIsOpen={setIsOpen} />

      <form
        ref={formRef}
        action={handleSubmit}
        className={clsx(
          "w-full bg-white shadow-md dark:bg-stone-900 rounded-t-[32px] absolute bottom-0 left-1/2 -translate-x-1/2 z-50 ease-linear duration-200 overflow-hidden flex flex-col gap-8 justify-between",
          {
            "h-[calc(100%_-_32px)] px-8 pt-12 pb-8": isOpen,
            "h-0 pt-0": !isOpen,
          }
        )}
      >
        <FormFields columns={columns} activeTask={activeTask} />
        <button type="submit"></button>
      </form>
    </>
  )
}

function FormFields({ columns, activeTask }: { columns: any[], activeTask: any }) {
  return (
    <>
      {columns.map(({ name, type }) => {
        switch (type) {
          case "text":
            return <TextField key={name} name={name} defaultValue={activeTask?.[name] || ""} />
          case "checkbox":
            return <CheckBoxField key={name} name={name} checked={!!activeTask?.[name]} />
          case "button":
            return <ButtonField key={name} name={name} activeTask={activeTask} />
          default:
            return null
        }
      })}
    </>
  )
}

function TextField({ name, defaultValue }: { name: string, defaultValue: string | number }) {
  const [value, setValue] = useState<string | number>('')
  console.log({ defaultValue })

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="mb-12">
      <input
        type="text"
        name={name}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={`Add ${name}`}
        className={name === "title" ? "text-4xl py-4 font-semibold w-full" : "text-lg py-2 w-full"}
      />
    </div>
  )
}

function CheckBoxField({ name, checked }: { name: string, checked: boolean }) {
  return (
    <label className="py-2 px-4 bg-stone-200 rounded-full flex items-center gap-2">
      <span>{name}</span>
      <input type="checkbox" name={name} defaultChecked={checked} />
    </label>
  )
}

function ButtonField({ name, activeTask }: { name: string, activeTask: any }) {
  if (name === "status") {
    return (
      <RadioGroup
        name="status"
        options={["not_started", "in_progress", "completed"]} selected={activeTask?.status}
      />
    )
  }

  return (
    <RadioGroup
      name="priority"
      options={["none", "low", "medium", "high", "urgent"]} selected={activeTask?.priority}
    />
  )
}

function RadioGroup({ name, options, selected }: { name: string, options: string[], selected: string }) {
  return (
    <div className="flex gap-4 items-center mb-4">
      <span className="capitalize">{name}</span>
      {options.map((value) => (
        <label key={value} className="py-2 px-4 bg-stone-200 rounded-full flex items-center gap-2">
          <span>{value}</span>
          <input type="radio" name={name} value={value} defaultChecked={selected === value} />
        </label>
      ))}
    </div>
  )
}
