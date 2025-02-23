import TaskContext from '@/context/TaskProvider'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'

export default function Pagenation() {
    const { pages } = useContext(TaskContext)
    let activePage = 1

    const generateUrl = (pageNumber: string) => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        activePage = Number(searchParams.get('page')) || 1

        searchParams.set('page', pageNumber)

        return `/?${searchParams}`
    }

    return (
        <div className="flex gap-4 items-center justify-center pt-2 ">
            {
                Array
                    .from({ length: pages }, (_, i) => i + 1)
                    .map(pageNumber => (
                        <Link
                            key={pageNumber}
                            href={generateUrl(`${pageNumber}`)}
                            className={clsx(
                                "aspect-square w-10 grid place-content-center rounded-full",
                                {
                                    "bg-black/70 text-white": pageNumber === activePage,
                                    "bg-stone-100 ": pageNumber !== activePage,
                                }
                            )}
                        >
                            {pageNumber}
                        </Link>
                    ))
            }
        </div>
    )
}
