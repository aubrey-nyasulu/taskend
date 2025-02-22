import UIContext from "@/context/UIProvider"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import ModalCloserBackground from "./ModalCloserBackground"
import clsx from "clsx"
import { debounce } from "@/lib/utils"
import { useEscape } from "@/customHooks/useEscape"

export default function TableFilter() {
    const [filterConstraint, setFilterConstraint] = useState('contains')
    const [filterValue, setFilterValue] = useState('')

    const { isFilterOpen, setIsFilterOpen } = useContext(UIContext)

    useEscape(() => setIsFilterOpen(false), isFilterOpen)

    const router = useRouter()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.set('page', '1')
        searchParams.set('filter', filterValue)
        searchParams.set('filterConstraint', filterConstraint)
        router.push(`/?${searchParams}`)

    }, [filterValue, filterConstraint])


    const deleteFilter = () => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.delete('filter')
        searchParams.delete('filterConstraint')
        router.push(`/?${searchParams}`)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen: isFilterOpen, setIsOpen: setIsFilterOpen }} />

            <div className="flex gap-2 items-center relative z-50">
                <button
                    onClick={() => setIsFilterOpen(prevState => !prevState)}
                    className="px-3 py-1 border rounded-md"
                >
                    Filter
                </button>

                <div className={clsx(
                    "py-3 px-4 bg-stone-50 shadow-lg border rounded-md absolute top-12 right-0",
                    {
                        "block": isFilterOpen,
                        "hidden": !isFilterOpen
                    }
                )}>
                    <div className="mb-4">
                        <select
                            name="filterBy"
                            id="filterBy"
                            className="py-2 px-3 mb-4"
                            onChange={e => {
                                setFilterConstraint(e.target.value)
                            }}
                        >
                            <option value='contains'>contains</option>
                            <option value='does not contain'>does not contain</option>
                            <option value='starts with'>starts with</option>
                            <option value='ends with'>ends with</option>
                        </select>

                        <input
                            type="text"
                            name="filter"
                            placeholder="Filter by title"
                            onChange={(e) => {
                                debounce(() => setFilterValue(e.target.value))
                            }}
                            className="py-2 px-3 max-w-[166px]"
                        />
                    </div>

                    <button
                        onClick={() => deleteFilter()}
                        className="opacity-80 px-2 py-1 border rounded-md bg-red-500 text-white"
                    >
                        Remove filter
                    </button>
                </div>
            </div>
        </>
    )
}