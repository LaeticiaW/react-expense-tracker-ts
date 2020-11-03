export interface Import {
    _id: string
    __v: number
    description: string
    fileName: string
    importDate: string
    recordCount: number
}

export interface ImportDetails {
    description: string
    fileName: string
    importDate: string
    recordCount: number
    dateFormat?: string
}

export interface ImportExpense {
    amount: number | string
    categoryId?: string | null
    description: string
    importId?: string
    subcategoryId: string | null
    trxDate: string
}

export interface ImportFilter {
    startDate: string | null
    endDate: string | null   
}
