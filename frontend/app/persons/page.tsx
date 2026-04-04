import { getPersons } from "@/api/get-table"
import { PersonsRender } from "@/components/charts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
    const datasetPromise = getPersons()

    return (
        <Tabs defaultValue="total" className="px-60 py-30">
            <TabsList>
                <TabsTrigger value="total">Total</TabsTrigger>
                <TabsTrigger value="per-id">Per Identity</TabsTrigger>
            </TabsList>

            <TabsContent value="total">
                <PersonsRender datasetPromise={datasetPromise} level="total" />
            </TabsContent>

            <TabsContent value="per-id">
                <PersonsRender
                    datasetPromise={datasetPromise}
                    level="per identity"
                />
            </TabsContent>
        </Tabs>
    )
}
