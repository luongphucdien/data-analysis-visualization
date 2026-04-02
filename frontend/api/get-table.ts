import { IdVsGenderType, OverallHealthType } from "@/types/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getIdVsGender = async () => {
    try {
        const response = await fetch(`${API_URL}/persons`, {
            method: "GET",
        })

        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`)
        }

        const result: IdVsGenderType[] = await response.json()
        return result
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function getOverallHealth() {
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: "GET",
        })

        const result: OverallHealthType = await response.json()
        return result
    } catch (error) {
        console.error(error)
        return { general: [], mental: [] } satisfies OverallHealthType
    }
}
