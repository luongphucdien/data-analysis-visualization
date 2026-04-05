import { OverallHealth, PersonsOnGender } from "@/types/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getBaseUrl = () => {
    if (!API_URL) {
        console.error(
            "NEXT_PUBLIC_API_URL is not defined"
        )
        return ""
    }
    return API_URL
}

export const getPersons = async (): Promise<PersonsOnGender[]> => {
    try {
        const response = await fetch(`${getBaseUrl()}/persons`)

        if (!response.ok) {
            throw new Error(
                `Failed to fetch /persons: ${response.status} ${response.statusText}`
            )
        }

        return await response.json()
    } catch (error) {
        console.error("API Error (getPersons):", error)
        return []
    }
}

export async function getOverallHealth(): Promise<OverallHealth[]> {
    try {
        const response = await fetch(`${getBaseUrl()}/health`)

        if (!response.ok) {
            throw new Error(
                `Failed to fetch /health: ${response.status} ${response.statusText}`
            )
        }

        return await response.json()
    } catch (error) {
        console.error("API Error (getOverallHealth):", error)
        return []
    }
}
