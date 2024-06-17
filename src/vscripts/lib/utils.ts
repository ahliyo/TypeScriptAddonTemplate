export function sleep(duration: number) {
    return new Promise((resolve, reject) => {
        Timers.CreateTimer(duration, () => resolve(""));
    });
}