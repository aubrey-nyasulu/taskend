import { SortIcon, SortingIcon } from "@/assets/svgAssets"
import UIContext from "@/context/UIProvider"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"

export default function Solt({ field }: { field: string }) {
    const [order, setOrder] = useState('a')

    const { currentSortField, setCurrentSortField } = useContext(UIContext)

    const router = useRouter()

    const sortByField = (arg: any) => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        const page = searchParams.get('page')
        const currentSortField = searchParams.get('sort')
        const currentSortOrder = searchParams.get('order')

        const order = currentSortField !== field ? 'a' : currentSortOrder === 'a' ? 'd' : 'a'

        searchParams.set('page', page || '1')
        searchParams.set('sort', field)
        searchParams.set('order', order)

        router.push(`/?${searchParams}`)
        setCurrentSortField(field)

        setOrder(order)
    }

    return (
        <button onClick={sortByField}>
            {
                currentSortField !== field &&
                <SortIcon />
            }

            {
                (currentSortField === field && order === 'a') &&
                <SortingIcon />
            }

            {
                (currentSortField === field && order === 'd') &&
                <div className="rotate-180"><SortingIcon /></div>
            }
        </button>
    )
}