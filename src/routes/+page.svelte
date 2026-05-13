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

  const width = $derived(xMax - xMin)
  const height = $derived(yMax - yMin)
  const viewBox = $derived(`${xMin} ${yMin} ${width} ${height}`)

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
      await goto(`${base}/publication?${query.toString()}`)
    } finally {
      console.log('clearing interval')
      clearInterval(interval)
      generating = false
    }
  }
</script>

<h1>Postdigital Publishing Practices: on Hybrid and Processual Print</h1>
<p>Select {minTopics} to {maxTopics} topics to generate a publication</p>

<form onsubmit={onGenerate}>
  <div>
    {#each data.topics as topic}
      <label>
        <input type="checkbox" name="topic" value={topic.id} bind:group={selectedTopics} />
        {topic.terms[0]}
      </label>
    {/each}
  </div>
  <div>
    <button type="submit">Generate publication</button>
  </div>
</form>

<svg class="scatter" viewBox={viewBox}>
  {#each data.docs as doc}
    <circle cx={doc.x} cy={doc.y} r="4" />
  {/each}
</svg>

{#if generating}
  <p>generating... (started {timeElapsed}s ago)</p>
{/if}

<style lang="scss">
  .scatter {
    outline: 1px solid var(--pink-dark);
    width: 100%;
    height: auto;
  }
  .scatter circle {
    stroke-width: 1px;
    stroke: var(--pink-dark);
    fill: var(--pink-light);
  }
</style>
