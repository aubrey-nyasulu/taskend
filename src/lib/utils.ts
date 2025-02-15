import { ColumnType } from "@/types"

type DuplicateExistsParams = {
    value: string
    columns: ColumnType[]
}

export const duplicateFielNameExists = ({ columns, value }: DuplicateExistsParams) => {
    const fieldExist = columns.find(({ name }) => name.toLowerCase() === value.toLowerCase())

    return !!fieldExist
}