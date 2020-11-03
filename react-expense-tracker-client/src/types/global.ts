export interface SnackOptions {
    show: boolean
    msg: string
    color: string
}

export interface Series {
    id?: string
    drilldown?: string
    name: string | null
    data?: [number | string, number | null][]
}

// export interface VueWithEventBus extends Vue {
//     dashboardEventBus: Vue
// }

// Component Instance Types
export interface SnackMsgComponent {
    show: { (error: boolean, msg: string, color?: string): void }
}

// Type for SnackMsg when accessed via this.$refs
// export type SnackMsgInstance = Vue & SnackMsgComponent

// Types for Vuetify
// export type VForm = Vue & { validate: () => boolean }
// export interface VForm extends Vue {
//     validate: {() : Boolean}
// }

// export interface VTreeView extends Vue {
//     updateAll: (expand: boolean) => void 
// }

export interface DashletOptions {
    x: number, 
    y: number, 
    i: string, 
    w: number, 
    h: number, 
    minH: number, 
    minW: number,
    component: string, 
    dashletTitle: string
}

// export type Rule = (value?: string) => boolean | string

// Augment Vue interface with global mixin methods and injections
// declare module 'vue/types/vue' {   
//     interface Vue {
//       sortArray: (arr : Array<any>, name: string) => void,
//       dashboardEventBus: Vue
//     }
// }
