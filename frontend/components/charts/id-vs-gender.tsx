"use client"

import { IdVsGenderType } from "@/types/types"
import { use } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"
import { ChartBase } from "./chart-base"

interface ChartProps {
    preview?: boolean
    datasetPromise: Promise<IdVsGenderType[]>
}

export const IdVsGender = ({ datasetPromise, preview = false }: ChartProps) => {
    const dataset = use(datasetPromise)

    const chartConfig = {
        men: {
            label: "Men+",
            color: "#4c72b0",
        },
        women: {
            label: "Women+",
            color: "#dd8452",
        },
        total: {
            label: "Total",
            color: "#55a868",
        },
    } satisfies ChartConfig

    return (
        <ChartBase config={chartConfig}>
            <BarChart
                accessibilityLayer
                data={dataset}
                layout="vertical"
                margin={{
                    left: 20,
                    right: 20,
                    top: 40,
                    bottom: 40,
                }}
            >
                <CartesianGrid horizontal={false} />
                <YAxis
                    dataKey="identity"
                    type="category"
                    tickLine={false}
                    tickMargin={20}
                    axisLine={true}
                    width={preview ? 0 : 150}
                    tick={!preview}
                />
                <XAxis type="number" />
                {!preview && <ChartTooltip content={<ChartTooltipContent />} />}
                <ChartLegend
                    content={<ChartLegendContent />}
                    verticalAlign="top"
                />

                <Bar dataKey={"men"} fill="var(--color-men)" radius={4} />
                <Bar dataKey={"women"} fill="var(--color-women)" radius={4} />
                <Bar dataKey={"total"} fill="var(--color-total)" radius={4} />
            </BarChart>
        </ChartBase>
    )
}
