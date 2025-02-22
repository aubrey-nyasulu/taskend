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
            {/* <ModalCloserBackground {...{ isOpen: isFilterOpen, setIsOpen: setIsFilterOpen }} /> */}

            <div className={clsx(
                "h-full bg-stone-50 shadow-sm border rounded-full overflow-hidden w-fit flex items-center z-30 ",
            )}>
                <select
                    name="filterBy"
                    id="filterBy"
                    className="py-2 w-[108px] bg-transparent pl-4 h-full "
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
                    placeholder="Search"
                    onChange={(e) => {
                        debounce(() => setFilterValue(e.target.value))
                    }}
                    className="py-4 px-3 h-full bg-transparent max-w-56 "
                />

                {/* <button
                        onClick={() => deleteFilter()}
                        className="opacity-80 px-2 py-1 border rounded-md bg-red-500 text-white"
                    >
                        Remove filter
                    </button> */}
            </div>
            {/* </div> */}
        </>
    )
}