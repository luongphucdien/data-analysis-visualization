export const tickLabelEllipsis = (value: string) => {
    const maxLength = 5
    if (value.length > maxLength) return `${value.substring(0, maxLength)}...`
    return value
}
