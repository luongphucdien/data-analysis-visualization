type IndigenousIdentity =
    | "First Nations (North American Indian)"
    | "First Nations (North American Indian), Registered or Treaty Indian"
    | "First Nations (North American Indian), not a Registered or Treaty Indian"
    | "Inuk (Inuit)"
    | "Métis"
    | "Total, Indigenous identity"

export type IdVsGenderType = {
    identity: IndigenousIdentity
} & Record<"men" | "women" | "total", number>

export type HealthType = { identity: IndigenousIdentity } & Record<
    "A" | "B_plus" | "B" | "C" | "F",
    number
>

export type OverallHealthType = Record<"general" | "mental", HealthType[]>
