"use client"

import { createContext, PropsWithChildren } from "react"
import { ChartConfig, ChartContainer } from "../ui/chart"

interface ChartContextProps {
    preview: boolean
}
export const ChartContext = createContext<ChartContextProps>({
    preview: false,
})

export interface ChartBaseProp extends PropsWithChildren {
    config: ChartConfig
}

export const ChartBase = (props: ChartBaseProp) => {
    const { config, children } = props

    return (
        <ChartContainer config={config} className="min-h-50 w-full">
            {children}
        </ChartContainer>
    )
}
