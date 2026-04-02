import { HTMLAttributes } from "react"

interface ChartSlotProps extends HTMLAttributes<HTMLDivElement> {
    title?: string
}

export const ChartSlot = (props: ChartSlotProps) => {
    const { title, children, ...others } = props

    return (
        <div className="px-6" {...others}>
            <p className="text-center">{title}</p>
            <>{children}</>
        </div>
    )
}
