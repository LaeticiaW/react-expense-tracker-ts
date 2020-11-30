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

export interface ImportFormData {
    csvFile?: File
    description: string
    dateFormat: string
    negativeExpenses: boolean
    hasHeaderRow: boolean
    dateField: string
    amountField: string | number
    descriptionField: string
}

export interface ImportExpense {
    amount: number | string
    categoryId?: string | undefined
    description: string
    importId?: string
    subcategoryId: string | undefined
    trxDate: string
}

export interface ImportFilter {
    startDate: string
    startDateMs?: number
    endDate: string
    endDateMs?: number 
}
