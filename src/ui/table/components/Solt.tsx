import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Solt({ field }: { field: string }) {
    const [order, setOrder] = useState('a')

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

        router.push(`/tasks?${searchParams}`)

        setOrder(order)
    }

    return (
        <button onClick={sortByField}>{order}</button>
    )
}