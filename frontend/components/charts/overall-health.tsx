"use client"

import { OverallHealthType } from "@/types/types"
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
    datasetPromise: Promise<OverallHealthType>
}

export const OverallHealth = ({
    datasetPromise,
    preview = false,
}: ChartProps) => {
    const dataset = use(datasetPromise)
    const data = dataset.general

    const config = {
        A: { label: "Excellent", color: "oklch(65% 0.2 150)" },
        B_plus: {
            label: "Excellent or very good",
            color: "oklch(70% 0.15 140)",
        },
        B: { label: "Very good", color: "oklch(75% 0.15 110)" },
        C: { label: "Good", color: "oklch(80% 0.15 85)" },
        F: { label: "Fair or poor", color: "oklch(60% 0.2 25)" },
    } satisfies ChartConfig

    return (
        <ChartBase config={config}>
            <BarChart
                data={data}
                margin={{
                    left: 20,
                    right: 20,
                    top: 40,
                    bottom: 40,
                }}
                layout="vertical"
            >
                <CartesianGrid
                    horizontal={false}
                    strokeDasharray={"3 3"}
                    opacity={0.3}
                />
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

                <Bar dataKey="A" stackId={"a"} fill="var(--color-A)" />
                <Bar
                    dataKey="B_plus"
                    stackId={"a"}
                    fill="var(--color-B_plus)"
                />
                <Bar dataKey="B" stackId={"a"} fill="var(--color-B)" />
                <Bar dataKey="C" stackId={"a"} fill="var(--color-C)" />
                <Bar
                    dataKey="F"
                    stackId={"a"}
                    fill="var(--color-F)"
                    radius={[0, 4, 4, 0]}
                />
            </BarChart>
        </ChartBase>
    )
}
