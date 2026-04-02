import { getIdVsGender, getOverallHealth } from "@/api/get-table"
import { ChartSlot, IdVsGender } from "@/components/charts"
import { OverallHealth } from "@/components/charts/overall-health"
import Link from "next/link"
import { Suspense } from "react"

export default function Page() {
    const idVsGenderPromise = getIdVsGender()
    const overallHealthPromise = getOverallHealth()

    return (
        <div className="grid grid-cols-3 gap-6 px-6 py-12">
            <ChartSlot title="Number of Persons by Indigenous Identity and Genders">
                <Link href={"/persons"}>
                    <Suspense fallback={<div>loading...</div>}>
                        <IdVsGender
                            datasetPromise={idVsGenderPromise}
                            preview
                        />
                    </Suspense>
                </Link>
            </ChartSlot>

            <ChartSlot title="Overall Health (general & mental)">
                <Link href={"/health"}>
                    <Suspense fallback={<>loading</>}>
                        <OverallHealth
                            datasetPromise={overallHealthPromise}
                            preview
                        />
                    </Suspense>
                </Link>
            </ChartSlot>
        </div>
    )
}
