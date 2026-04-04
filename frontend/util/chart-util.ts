import { HealthStatus, HealthType, OverallHealth } from "@/types/types"

export const hideTickLabel = (value: string) => {
    const maxLength = 5
    if (value.length > maxLength) return `${value.substring(0, maxLength)}...`
    return value
}

type TotalHealthFilter = {
    health_status: HealthStatus
} & Record<HealthType, number>

export const filterHealthTotal = (
    dataset: OverallHealth[]
): TotalHealthFilter[] => {
    const total = dataset.filter(
        (item) => item.identity === "Total, Indigenous identity"
    )
    const health_order = ["A", "B_plus", "B", "C", "F"]

    const group_map = new Map<HealthStatus, TotalHealthFilter>()
    health_order.forEach((health) => {
        group_map.set(health as HealthStatus, {
            health_status: health as HealthStatus,
            general: 0,
            mental: 0,
        })
    })

    total.forEach((item) => {
        const entry = group_map.get(item.health_status)
        if (entry) {
            entry[item.type] = item.total
        }
    })

    return Array.from(group_map.values())
}
