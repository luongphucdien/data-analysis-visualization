import { getOverallHealth, getPersons } from "@/api/get-table"
import { ChartSlot, PersonsRender } from "@/components/charts"
import { OverallHealthRender } from "@/components/charts/overall-health"
import Link from "next/link"
import { Suspense } from "react"

export default function Page() {
    const personsPromise = getPersons()
    const overallHealthPromise = getOverallHealth()

    return (
        <div className="grid grid-cols-3 gap-6 px-6 py-12">
            <ChartSlot title="Number of Persons by Genders">
                <Link href={"/persons"}>
                    <Suspense fallback={<div>loading...</div>}>
                        <PersonsRender
                            datasetPromise={personsPromise}
                            preview
                        />
                    </Suspense>
                </Link>
            </ChartSlot>

            <ChartSlot title="Overall Health (General & Mental)">
                <Link href={"/health"}>
                    <Suspense fallback={<>loading</>}>
                        <OverallHealthRender
                            datasetPromise={overallHealthPromise}
                            preview
                        />
                    </Suspense>
                </Link>
            </ChartSlot>

            <ChartSlot title="Overall Health by Age" />
        </div>
    )
}
