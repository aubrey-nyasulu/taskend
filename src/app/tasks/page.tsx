"use client"

import Table from "@/components/Table"
import clsx from "clsx"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <main className="h-screen flex-1 flex flex-col items-center justify-between gap-10 min-h-screen px-4">
      <div className="w-full h-16 rounded-2xl mt-4">
        <div className="w-16 h-16 rounded-full bg-stone-200 float-right mr-4"></div>
      </div>

      <section className="relative w-full h-full ">
        <div className={clsx(
          "bg-white shadow-md dark:bg-stone-900 w-full h-full rounded-t-[32px] pt-8",
          {
            "opacity-40 scale-95": modalIsOpen
          }
        )}>
          <div className="w-full mx-auto max-w-4xl">
            <button className="border-b-[3px] border-b-stone-700 h-fit pb-2 px-4 mr-4 focus:ring-1 focus:ring-stone-700">Table</button>

            <button className="focus:ring-1 focus:ring-stone-700 pb-2 px-4">Board</button>
          </div>

          <Table />
        </div>

        <CreateTaskModal {...{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }} />
      </section>

      <button
        onClick={() => setModalIsOpen(true)}
        className="py-4 px-8 bg-stone-800 text-white rounded-xl absolute bottom-4 right-8 z-30 "
      >
        Create Task
      </button>
    </main>
  )
}


const CreateTaskModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
  // Close on Escape Key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, setIsOpen])

  return (
    <div
      className={clsx(
        "bg-white shadow-md dark:bg-stone-900  rounded-t-[32px]  absolute bottom-0 left-[50%] -translate-x-[50%] z-40 ease-linear duration-200 overflow-hidden flex gap-8 flex-col justify-between ",
        {
          "w-full h-[calc(100%_-_32px)] px-8 pt-16 pb-8": isOpen,
          "w-full h-0 pt-0": !isOpen,
        }
      )}
    >
      <h1 className="mb-12">
        <input
          type="text"
          placeholder="Add Title"
          className="text-4xl font-semibold "
        />
      </h1>

      <div className="flex gap-4 items-center mb-4">
        Status

        <label
          htmlFor="not_started"
          className="py-2 px-4 bg-stone-200 rounded-full"
        >
          <span className="mr-2">
            Not Started
          </span>

          <input
            type="radio"
            name="status"
            id="not_started"
            value="not_started"
          />
        </label>

        <label
          htmlFor="in_progress"
          className="py-2 px-4 bg-stone-200 rounded-full"
        >
          <span className="mr-2">
            In Progess
          </span>

          <input
            type="radio"
            name="status"
            id="in_progress"
            value="in_progress"
          />
        </label>

        <label
          htmlFor="completed"
          className="py-2 px-4 bg-stone-200 rounded-full"
        >
          <span className="mr-2">
            Completed
          </span>

          <input
            type="radio"
            name="status"
            id="completed"
            value="completed"
          />
        </label>
      </div>

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
    </div>
  )
}