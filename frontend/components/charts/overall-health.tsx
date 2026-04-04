"use client"

import { HealthStatus, HealthStatusMap, OverallHealth } from "@/types/types"
import { filterHealthTotal } from "@/util/chart-util"
import { title } from "process"
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
    datasetPromise: Promise<OverallHealth[]>
}

export const OverallHealthRender = ({
    datasetPromise,
    preview = false,
}: ChartProps) => {
    const dataset = use(datasetPromise)
    const total_filtered = filterHealthTotal(dataset)

    const config = {
        general: { label: "General Health", color: "oklch(62.5% 0.18 250)" },
        mental: { label: "Mental Health", color: "oklch(55% 0.13 195)" },
    } satisfies ChartConfig

    return (
        <ChartBase config={config}>
            <BarChart
                data={total_filtered}
                margin={{
                    left: 20,
                    right: 20,
                    top: 40,
                    bottom: 40,
                }}
            >
                <CartesianGrid
                    vertical={false}
                    strokeDasharray={"3 3"}
                    opacity={0.3}
                />
                <XAxis
                    dataKey="health_status"
                    tickLine={false}
                    tickMargin={20}
                    axisLine={true}
                    width={preview ? 0 : 150}
                    tick={!preview}
                    tickFormatter={(tick: HealthStatus) =>
                        HealthStatusMap[tick] || tick
                    }
                />
                <YAxis />
                {!preview && (
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={(label) =>
                                    HealthStatusMap[label as HealthStatus] ||
                                    title
                                }
                            />
                        }
                    />
                )}

                <ChartLegend
                    content={<ChartLegendContent />}
                    verticalAlign="top"
                />

                <Bar
                    dataKey="general"
                    fill="var(--color-general)"
                    radius={[6, 6, 0, 0]}
                />
                <Bar
                    dataKey="mental"
                    fill="var(--color-mental)"
                    radius={[6, 6, 0, 0]}
                />
            </BarChart>
        </ChartBase>
    )
}
