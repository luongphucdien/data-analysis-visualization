import { getOverallHealth } from "@/api/get-table"
import { OverallHealthRender } from "@/components/charts/overall-health"

export default function Page() {
    const overallHealthPromise = getOverallHealth()

    return (
        <div className="px-60 py-30">
            <OverallHealthRender datasetPromise={overallHealthPromise} />
        </div>
    )
}
