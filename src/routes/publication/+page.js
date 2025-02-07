export const prerender = false

// const [generate, summarize] = await Promise.all([
//   pipeline('text-generation', 'Xenova/distilgpt2'),
//   pipeline('summarization', 'Xenova/bart-large-cnn')
// ])
// const summarize = await pipeline('summarization', 'Xenova/bart-large-cnn')

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
