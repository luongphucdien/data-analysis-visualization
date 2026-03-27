"use client"

import { IdVsGenderType } from "@/types/types"
import { tickLabelEllipsis } from "@/util/chart-util"
import { Suspense, use } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "../ui/chart"

export const IdVsGender = ({
    datasetPromise,
}: {
    datasetPromise: Promise<IdVsGenderType[]>
}) => {
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
        <Suspense fallback={<p>loading...</p>}>
            <ChartContainer config={chartConfig} className="min-h-50 w-full">
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
                        tickFormatter={tickLabelEllipsis}
                        axisLine={true}
                        width={150}
                    />
                    <XAxis type="number" />
                    {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
                    <ChartLegend
                        content={<ChartLegendContent />}
                        verticalAlign="top"
                    />

                    <Bar dataKey={"men"} fill="var(--color-men)" radius={4} />
                    <Bar
                        dataKey={"women"}
                        fill="var(--color-women)"
                        radius={4}
                    />
                    <Bar
                        dataKey={"total"}
                        fill="var(--color-total)"
                        radius={4}
                    />
                </BarChart>
            </ChartContainer>
        </Suspense>
    )
}
