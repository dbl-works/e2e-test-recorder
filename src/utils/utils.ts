export async function waitUntil(predicate: () => boolean) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (predicate()) {
        clearInterval(interval)
        resolve()
      }
    }, 10)
  })
}
