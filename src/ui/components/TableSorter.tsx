import UIContext from "@/context/UIProvider"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import ModalCloserBackground from "./ModalCloserBackground"
import clsx from "clsx"
import { useEscape } from "@/customHooks/useEscape"
import { Sort } from "@/assets/svgAssets"

export default function TableSorter() {
    const [sortBy, setFilterBy] = useState('')
    const [filterOrder, setFilterOrder] = useState<'a' | 'd'>('a')

    const { isSortOpen, setIsSortOpen } = useContext(UIContext)

    useEscape(() => setIsSortOpen(false), isSortOpen)

    const router = useRouter()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.set('sort', sortBy)
        searchParams.set('order', filterOrder)
        router.push(`/?${searchParams}`)

        setFilterBy(sortBy)
        setFilterOrder(filterOrder)
    }, [sortBy, filterOrder])

    const deleteSort = () => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.delete('sort')
        searchParams.delete('order')
        router.push(`/?${searchParams}`)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen: isSortOpen, setIsOpen: setIsSortOpen }} />

            <div className="h-full  flex gap-2 items-center bg-stone-50 shadow-sm border rounded-full relative z-50">
                <button
                    onClick={() => setIsSortOpen(prevState => !prevState)}
                    className="px-3 py-1 rounded-md flex items-center gap-1 font-semibold "
                >
                    <span className="hidden md:block">Sort</span> <Sort />
                </button>

                <div className={clsx(
                    "py-2 px-4 bg-stone-50 shadow-lg border rounded-md absolute top-[72px] right-0",
                    {
                        "block": isSortOpen,
                        "hidden": !isSortOpen
                    }
                )}>
                    <div className="flex gap-4 items-center mb-4">
                        <select
                            name="sortBy"
                            id="sortBy"
                            onChange={e => setFilterBy(e.currentTarget.value)}
                            className="py-2 px-3"
                        >
                            <option value='status'>status</option>
                            <option value='priority'>priority</option>
                        </select>

                        <select
                            name="filterOrder"
                            id="filterOrder"
                            onChange={e => setFilterOrder(e.target.value as 'a' | 'd')}
                            className="py-2 px-3"
                        >
                            <option value="a">ascending</option>
                            <option value="d">descending</option>
                        </select>
                    </div>

                    <button
                        onClick={deleteSort}
                        className="opacity-80 px-2 py-1 border rounded-md bg-red-500 text-white"
                    >
                        Delete sort
                    </button>
                </div>
            </div>
        </>
    )
}