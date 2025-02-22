"use client"

import TableFilter from "@/ui/components/TableFilter";
import TableSorter from "@/ui/components/TableSorter";
import UndoRedo from "@/ui/components/UndoRedo";

export default function SearchSortAndFilter() {
    return (
        <div className="w-full h-16 flex gap-2 md:gap-4 items-center justify-between z-30 px-2 md:px-0 ">
            <TableFilter />
            {/* <UndoRedo /> */}
            <TableSorter />
        </div>
    )
}
