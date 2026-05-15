<script>
  import { goto } from '$app/navigation'
  import { base } from '$app/paths'
  const { data } = $props()

  const minTopics = 2,
    maxTopics = 5

  /** @type {number[]} */
  let selectedTopics = $state([])
  let generating = $state(false)
  let timeElapsed = $state(0)
  let { xMin, xMax, yMin, yMax } = $derived(data.docs.reduce((acc, doc) => {
    if (doc.x < acc.xMin) acc.xMin = doc.x
    if (doc.x > acc.xMax) acc.xMax = doc.x
    if (doc.y < acc.yMin) acc.yMin = doc.y
    if (doc.y > acc.yMax) acc.yMax = doc.y
    return acc
  }, { xMin: Number.MAX_SAFE_INTEGER, xMax: 0, yMin: Number.MAX_SAFE_INTEGER, yMax: 0 }))

  const clearX = 50;
  const clearY = 20;
  const width = $derived(xMax - xMin)
  const height = $derived(yMax - yMin)
  const viewBox = $derived(`${xMin - clearX} ${yMin - clearY} ${width + clearX * 2} ${height + clearY * 2}`)

  /**
   * @param {SubmitEvent} event
   */
  async function onGenerate(event) {
    generating = true
    const interval = setInterval(() => {
      timeElapsed++
    }, 1000)
    try {
      event.preventDefault()
      const query = new URLSearchParams()
      selectedTopics.forEach((topic) => query.append('t', String(topic)))
      // FIXME: explore shallow routing to avoid navigating
      await goto(`${base}/publication?${query.toString()}`)
    } finally {
      console.log('clearing interval')
      clearInterval(interval)
      generating = false
    }
  }
</script>

<div class="grid">
  <div class="grid__cols">
    <header class="grid-col-12 page__header">
      <h1>Postdigital Publishing Practices:<br>on Hybrid and Processual Print</h1>
    </header>
    <main class="grid-col-12">
      <p>Select {minTopics} to {maxTopics} topics to generate a publication</p>
      <form onsubmit={onGenerate}>
        <div>
          {#each data.topics as topic}
            <label>
              <input type="checkbox" name="topic" value={topic.id} bind:group={selectedTopics} />
              {topic.main}
            </label>
          {/each}
        </div>
        <div>
          <button type="submit">Generate publication</button>
        </div>
      </form>
      {#if generating}
        <p>generating... (started {timeElapsed}s ago)</p>
      {/if}
      <svg class="scatter" viewBox={viewBox}>
        {#each data.docs as doc}
          <circle cx={doc.x} cy={doc.y} r="4" />
        {/each}
      </svg>
    </main>
  </div>
</div>



<style lang="scss">
.scatter {
  position: fixed;
  inset: 0;
  outline: 1px solid var(--pink-dark);
  width: 100%;
  height: auto;
  z-index: -1;
}
.scatter circle {
  stroke-width: 1px;
  stroke: var(--pink-dark);
  fill: var(--pink-light);
}
</style>
