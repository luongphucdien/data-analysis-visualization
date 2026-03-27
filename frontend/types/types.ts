type IndigenousIdentity =
    | "First Nations (North American Indian)"
    | "First Nations (North American Indian), Registered or Treaty Indian"
    | "First Nations (North American Indian), not a Registered or Treaty Indian"
    | "Indigenous responses not included elsewhere"
    | "Inuk (Inuit)"
    | "Métis"
    | "Total, Indigenous identity"

export type IdVsGenderType = {
    identity: IndigenousIdentity
} & Record<"men" | "women" | "total", number>
