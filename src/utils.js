export async function waitUntil(predicate) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (predicate()) {
        clearInterval(interval)
        resolve()
      }
    }, 10)
  })
}
