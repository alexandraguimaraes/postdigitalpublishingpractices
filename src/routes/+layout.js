export const ssr = false
export const prerender = false

export async function load() {
  if (window.Worker) {
    console.log('creating web worker')
    const MyWoker = await import('$lib/worker.js?worker')
    /** @type {Worker} */
    const worker = new MyWoker.default()
    return { worker }
  }
}
