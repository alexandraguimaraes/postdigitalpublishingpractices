export const prerender = false

export async function load({ parent, url }) {
  const { worker } = await parent()
  const topics = url.searchParams.getAll('t').map((t) => Number(t))
  return new Promise((resolve, reject) => {
    worker.postMessage({ topics })
    worker.addEventListener('message', (e) => {
      console.log(e.data)
      resolve(e.data)
    })
  })
}
