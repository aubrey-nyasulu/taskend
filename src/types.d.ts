export type RowType = {
    [index: string]: string | number
    Title: string
    Status: string
    Priority: string
}

export type ColumnType = {
    name: string;
    type: string | number | checkbox;
}