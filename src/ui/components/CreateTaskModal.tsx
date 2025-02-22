import TaskContext from "@/context/TaskProvider"
import { RowType } from "@/types"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useContext, useEffect, useRef } from "react"
import ModalCloserBackground from "./ModalCloserBackground"
import UIContext from "@/context/UIProvider"

export default function CreateTaskModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  const { columns, createTask } = useContext(TaskContext)
  const { activeTask } = useContext(UIContext)

  // Close on Escape Key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, setIsOpen])

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset()
    }
  }, [isOpen])

  const router = useRouter()
  const handleSubmit = (formData: FormData) => {
    let data: any = formData.entries()

    data = Object.fromEntries(data) as RowType

    createTask(data)

    formRef.current?.reset()
    setIsOpen(false)

    router.push('/tasks?page=1')
    // window.location.href = '/tasks?page=1'
  }

  return (
    <>
      <ModalCloserBackground {...{ isOpen, setIsOpen }} />

      <form
        ref={formRef}
        action={handleSubmit}
        className={clsx(
          "w-full bg-white shadow-md dark:bg-stone-900  rounded-t-[32px]  absolute bottom-0 left-[50%] -translate-x-[50%] z-[99] ease-linear duration-200 overflow-hidden flex gap-8 flex-col justify-between ",
          {
            "w-full h-[calc(100%_-_32px)] px-8 pt-12 pb-8": isOpen,
            "w-full h-0 pt-0": !isOpen,
          }
        )}
      >
        <div>
          {
            columns.map(({ name, type }) => (
              type === 'text' &&
              <CreateTaskTextField
                key={name}
                {...{ name, defaultValue: activeTask ? activeTask[name] : '' }}
              />
            ))
          }
        </div>

        <div>
          {
            columns.map(({ name, type }) => (
              type === 'checkbox' &&
              <CreateTaskCheckBoxField
                key={name}
                {...{
                  name,
                  checked: activeTask
                    ? activeTask[name] === activeTask[name]
                    : false
                }}
              />
            ))
          }
        </div>

        <div>
          {
            columns.map(({ name, type }) => (
              type === 'button' &&
              <CreateTaskButtons
                key={name}
                {...{
                  name,
                  status: activeTask ? activeTask.status : '',
                  priority: activeTask ? activeTask.priority : '',
                }}
              />
            ))
          }
        </div>

        <button type="submit"></button>
      </form >
    </>
  )
}

function CreateTaskTextField({ name, defaultValue }: { name: string, defaultValue: string | number }) {
  return (
    <>
      {
        name === 'title'
          ? (
            <h1 className="mb-12">
              <input
                type="text"
                name={name}
                defaultValue={defaultValue}
                placeholder="Add Title"
                className="text-4xl py-4 font-semibold  w-full "
              />
            </h1>
          )
          : (
            <p className="mb-12">
              <input
                type="text"
                name={name}
                placeholder={`Add ${name}`}
                className="text-lg py-2 w-full "
              />
            </p>
          )
      }
    </>
  )
}

function CreateTaskCheckBoxField({ name, checked }: { name: string, checked: boolean }) {
  return (
    <>
      <label
        htmlFor={name}
        className="py-2 px-4 bg-stone-200 rounded-full"
      >
        <span className="mr-2">
          {name}
        </span>

        <input
          type="checkbox"
          name={name}
          id={name}
          defaultChecked={checked}
        />
      </label>
    </>
  )
}

function CreateTaskButtons({ name, status, priority }: { name: string, status: string, priority: string }) {
  console.log('recei', { status, priority })

  return (
    <>
      {
        name === 'status'
          ? (
            <div
              key={name}
              className="flex gap-4 items-center mb-4">
              Status

              {
                ["not_started", "in_progress", "completed"]
                  .map(value => (
                    <label
                      key={value}
                      htmlFor={value}
                      className="py-2 px-4 bg-stone-200 rounded-full"
                    >
                      <span className="mr-2">
                        {value}
                      </span>

                      <input
                        type="radio"
                        name="status"
                        id={value}
                        value={value}
                        defaultChecked={status === value}
                      />
                    </label>
                  ))
              }
            </div>
          )

          : (
            <div className="flex gap-4 items-center">
              Priority

              {
                ["none", "low", "medium", "high", "urgent"]
                  .map(value => (
                    <label
                      key={value}
                      htmlFor={value}
                      className="py-2 px-4 bg-stone-200 rounded-full"
                    >
                      <span className="mr-2">
                        {value}
                      </span>

                      <input
                        type="radio"
                        name="priority"
                        id={value}
                        value={value}
                        defaultChecked={priority === value}
                      />
                    </label>
                  ))
              }
            </div>
          )
      }
    </>
  )
}