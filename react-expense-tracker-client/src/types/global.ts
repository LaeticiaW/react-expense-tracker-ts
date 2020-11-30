export interface SnackOptions {
    show: boolean
    msg: string
    color: string
}

export type SeriesData = [number | string, number | null][]

export interface Series {
    id?: string
    drilldown?: string
    name: string | null
    data?: SeriesData
}

// Component Instance Types
export interface SnackMsgComponent {
    show: { (error: boolean, msg: string, color?: string): void }
}

export interface DashletOptions {
    x: number, 
    y: number, 
    i: string, 
    w: number, 
    h: number, 
    minH: number, 
    minW: number,
    component: (options: DashletOptions) => JSX.Element, 
    dashletTitle: string
}

export interface User {
    id: string
    firstName: string
    lastName: string
}

export type ReactGridLayoutType = ReactGridLayout & DashletOptions
