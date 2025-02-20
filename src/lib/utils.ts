import { ColumnType, RowType } from "@/types"

export function filterTasks(tasks: RowType[], filterValue: string, filterConstraint: 'contains' | 'does not contain' | 'starts with' | 'ends with'): RowType[] {
    return tasks.filter(task => {
        const title = task.title.toLowerCase()
        const query = filterValue.toLowerCase()

        switch (filterConstraint) {
            case 'contains':
                return title.includes(query)
            case 'does not contain':
                return !title.includes(query)
            case 'starts with':
                return title.startsWith(query)
            case 'ends with':
                return title.endsWith(query)
            default:
                return true
        }
    })
}

export function sortTasks(tasks: RowType[], sortBy: string, order: 'a' | 'd'): RowType[] {
    return tasks.sort((a, b) => {
        const aValue = a[sortBy]?.toString().toLowerCase() || ''
        const bValue = b[sortBy]?.toString().toLowerCase() || ''

        return order === 'a' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    })
}

export function getStoredColumns(): ColumnType[] {
    return JSON.parse(localStorage.getItem('columns') ?? '[]')
}

export function setStoredColumns(tasks: ColumnType[]): void {
    localStorage.setItem('columns', JSON.stringify(tasks))
}

export function getStoredTasks(): RowType[] {
    return JSON.parse(localStorage.getItem('tasks') || '[]')
}

export function setStoredTasks(tasks: RowType[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

export const debounce = (() => {
    let timer: NodeJS.Timeout | undefined

    return (callback: Function) => {
        if (timer !== undefined) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            callback()
        }, 400)
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
    return Math.ceil(length / limit)
}
