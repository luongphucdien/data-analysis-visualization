import { getOverallHealth } from "@/api/get-table"
import { OverallHealth } from "@/components/charts/overall-health"

export default function Page() {
    const overallHealthPromise = getOverallHealth()

    return (
        <>
            <OverallHealth datasetPromise={overallHealthPromise} />
        </>
    )
}
