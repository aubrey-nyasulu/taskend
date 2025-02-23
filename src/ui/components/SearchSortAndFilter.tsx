"use client"

import TableFilter from "@/ui/components/TableFilter";
import TableSorter from "@/ui/components/TableSorter";

export default function SearchSortAndFilter() {
    return (
        <div className="w-full h-16 flex gap-2 md:gap-4 items-center justify-between z-30 px-2 md:px-0 ">
            <TableFilter />
            <TableSorter />
        </div>
    )
}
