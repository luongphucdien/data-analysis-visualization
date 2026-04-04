"use client"

import { PersonsOnGender } from "@/types/types"
import { use } from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Pie,
    PieChart,
    XAxis,
    YAxis,
} from "recharts"
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
    datasetPromise: Promise<PersonsOnGender[]>
    level?: "total" | "per identity"
}

export const PersonsRender = ({
    datasetPromise,
    preview = false,
    level = "total",
}: ChartProps) => {
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

    const splitSets = dataset.reduce(
        (acc, item) => {
            if (item.identity === "Total, Indigenous identity") {
                acc.totalSet.push(item)
            } else {
                acc.otherSets.push(item)
            }
            return acc
        },
        {
            totalSet: [] as PersonsOnGender[],
            otherSets: [] as PersonsOnGender[],
        }
    )

    const total_fixed = [
        {
            gender: "men",
            persons: splitSets.totalSet[0].men,
            fill: "var(--color-men)",
        },
        {
            gender: "women",
            persons: splitSets.totalSet[0].women,
            fill: "var(--color-women)",
        },
    ]

    return (
        <ChartBase config={chartConfig}>
            {level === "total" && (
                <PieChart>
                    {!preview && (
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                    )}
                    <ChartLegend
                        content={<ChartLegendContent />}
                        verticalAlign="top"
                    />
                    <Pie
                        data={total_fixed}
                        dataKey={"persons"}
                        nameKey={"gender"}
                        innerRadius={preview ? 30 : 120}
                        strokeWidth={5}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={
                                                    preview
                                                        ? viewBox.cy + 102
                                                        : viewBox.cy
                                                }
                                                className={`fill-foreground font-bold ${preview ? "text-xs" : "text-3xl"}`}
                                            >
                                                {splitSets.totalSet[0].total.toLocaleString()}
                                            </tspan>

                                            {!preview && (
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 36}
                                                    className="fill-muted-foreground text-2xl"
                                                >
                                                    Total
                                                </tspan>
                                            )}
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            )}

            {level === "per identity" && (
                <BarChart
                    accessibilityLayer
                    data={splitSets.otherSets}
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
                    {!preview && (
                        <ChartTooltip content={<ChartTooltipContent />} />
                    )}
                    <ChartLegend
                        content={<ChartLegendContent />}
                        verticalAlign="top"
                    />

                    <Bar
                        dataKey={"men"}
                        fill="var(--color-men)"
                        radius={[0, 4, 4, 0]}
                    />
                    <Bar
                        dataKey={"women"}
                        fill="var(--color-women)"
                        radius={[0, 4, 4, 0]}
                    />
                    <Bar
                        dataKey={"total"}
                        fill="var(--color-total)"
                        radius={[0, 4, 4, 0]}
                    />
                </BarChart>
            )}
        </ChartBase>
    )
}
