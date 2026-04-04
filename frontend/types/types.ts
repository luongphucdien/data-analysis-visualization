type IndigenousIdentity =
    | "First Nations (North American Indian)"
    | "First Nations (North American Indian), Registered or Treaty Indian"
    | "First Nations (North American Indian), not a Registered or Treaty Indian"
    | "Inuk (Inuit)"
    | "Métis"
    | "Total, Indigenous identity"

export type PersonsOnGender = {
    identity: IndigenousIdentity
} & Record<"men" | "women" | "total", number>

type AgeGroup = Record<
    "15_24" | "25_34" | "35_44" | "45_54" | "55_over" | "total",
    number
>

export type HealthStatus = "A" | "B_plus" | "B" | "C" | "F"

export type HealthType = "general" | "mental"

export type OverallHealth = {
    identity: IndigenousIdentity
    health_status: HealthStatus
    type: HealthType
} & AgeGroup

export const HealthStatusMap: Record<HealthStatus, string> = {
    A: "Excellent",
    B_plus: "Excellent or Very Good",
    B: "Very Good",
    C: "Good",
    F: "Fair or Poor",
}
