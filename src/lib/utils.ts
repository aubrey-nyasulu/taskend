import { ColumnType } from "@/types"

export const debounce = (() => {
    let timer: NodeJS.Timeout | undefined

    return (callback: Function) => {
        if (timer !== undefined) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            callback()
        }, 400);
    }
})()

type DuplicateExistsParams = {
    value: string
    columns: ColumnType[]
}

export const duplicateFielNameExists = ({ columns, value }: DuplicateExistsParams) => {
    const fieldExist = columns.find(({ name }) => name.toLowerCase() === value.toLowerCase())

    return !!fieldExist
}

export const countPages = (length: number, limit: number) => {
    return Math.round(length / limit)
}