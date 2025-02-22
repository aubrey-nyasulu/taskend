import TaskContext from '@/context/TaskProvider'
import Link from 'next/link'
import React, { useContext } from 'react'

export default function Pagenation() {
    const { pages } = useContext(TaskContext)

    const generateUrl = (pageNumber: string) => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.set('page', pageNumber)

        return `/tasks?${searchParams}`
    }

    return (
        <div className="flex gap-4 items-center">
            {
                Array
                    .from({ length: pages }, (_, i) => i + 1)
                    .map(pageNumber => (
                        <Link
                            key={pageNumber}
                            href={generateUrl(`${pageNumber}`)}
                            className="aspect-square w-8 grid place-content-center bg-stone-100 rounded-full"
                        >
                            {pageNumber}
                        </Link>
                    ))
            }
        </div>
    )
}
