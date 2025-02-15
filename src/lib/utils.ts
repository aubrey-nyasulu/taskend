import { ColumnType } from "@/types"

type DuplicateExistsParams = {
    value: string
    columns: ColumnType[]
}

export const duplicateFielNameExists = ({ columns, value }: DuplicateExistsParams) => {
    const fieldExist = columns.find(({ name }) => name === value)

    return !!fieldExist
}