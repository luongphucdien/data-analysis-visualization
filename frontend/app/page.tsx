import { getIdVsGender } from "@/api/get-table"
import { IdVsGender } from "@/components/charts"
import { Suspense } from "react"

export default function Page() {
    const datasetPromise = getIdVsGender()

    return (
        <div className="grid grid-cols-3">
            <div>
                <p className="text-center">
                    Number of Persons by Indigenous Identity and Genders
                </p>
                <Suspense fallback={<div>loading...</div>}>
                    <IdVsGender datasetPromise={datasetPromise} />
                </Suspense>
            </div>
        </div>
    )
}
