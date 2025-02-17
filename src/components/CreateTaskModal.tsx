import TaskContext from "@/context/TaskProvider"
import { RowType } from "@/types"
import clsx from "clsx"
import { Dispatch, SetStateAction, useContext, useEffect, useRef } from "react"

export default function CreateTaskModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  const { columns, createTask } = useContext(TaskContext)

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

  const handleSubmit = (formData: FormData) => {
    let data: any = formData.entries()

    data = Object.fromEntries(data) as RowType

    createTask(data)

    formRef.current?.reset()
    setIsOpen(false)
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className={clsx(
        "w-full bg-white shadow-md dark:bg-stone-900  rounded-t-[32px]  absolute bottom-0 left-[50%] -translate-x-[50%] z-40 ease-linear duration-200 overflow-hidden flex gap-8 flex-col justify-between ",
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
              {...{ name }}
            />
          ))
        }
      </div>

      <div>
        {
          columns.map(({ name, type }) => (
            type === 'checkbox' &&
            <CreateTaskCheckBoxField key={name} name={name} />
          ))
        }
      </div>

      <div>
        {
          columns.map(({ name, type }) => (
            type === 'button' &&
            <CreateTaskButtons key={name} name={name} />
          ))
        }
      </div>

      <button type="submit"></button>
    </form >
  )
}

function CreateTaskTextField({ name }: { name: string }) {
  return (
    <>
      {
        name === 'title'
          ? (
            <h1 className="mb-12">
              <input
                type="text"
                name={name}
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

function CreateTaskCheckBoxField({ name }: { name: string }) {
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
        />
      </label>
    </>
  )
}

function CreateTaskButtons({ name }: { name: string }) {
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
                ["not_started", "in_progress", "completed"].map(value =>
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
                    />
                  </label>
                )
              }
            </div>
          )

          : (
            <div className="flex gap-4 items-center">
              Priority

              <label
                htmlFor="none"
                className="py-2 px-4 bg-stone-200 rounded-full"
              >
                <span className="mr-2">
                  none
                </span>

                <input
                  type="radio"
                  name="priority"
                  id="none"
                  value="none"
                />
              </label>

              <label
                htmlFor="low"
                className="py-2 px-4 bg-stone-200 rounded-full"
              >
                <span className="mr-2">
                  low
                </span>

                <input
                  type="radio"
                  name="priority"
                  id="low"
                  value="low"
                />
              </label>

              <label
                htmlFor="medium"
                className="py-2 px-4 bg-stone-200 rounded-full"
              >
                <span className="mr-2">
                  medium
                </span>

                <input
                  type="radio"
                  name="priority"
                  id="medium"
                  value="medium"
                />
              </label>

              <label
                htmlFor="high"
                className="py-2 px-4 bg-stone-200 rounded-full"
              >
                <span className="mr-2">
                  high
                </span>

                <input
                  type="radio"
                  name="priority"
                  id="high"
                  value="high"
                />
              </label>
            </div>
          )
      }
    </>
  )
}