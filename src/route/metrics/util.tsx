// Utils for metrics
export const getTimeMinHrs = (duration: number) => {
    const minutes = duration / 60000000000
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.ceil(((minutes / 60) % 1) * 60)
    return {hours, min: remainingMinutes}
}

export const MAX_ATTEMPTS = 10
