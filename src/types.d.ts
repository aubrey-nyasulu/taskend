export type RowType = {
    [index: string]: string | number
    id: number
    title: string
    status: string
    priority: string
}

export type ColumnType = {
    name: string;
    type: 'text' | 'number' | 'checkbox' | 'button';
}