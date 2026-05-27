<script>
  import { goto } from '$app/navigation'
  import { base } from '$app/paths'
  import * as d3 from 'd3'

  const { data } = $props()

  // Expands the docs so that there are repeated entries for excerpts
  // that belong to multiple topics, one entry for each topic
  const expandedDocs = data.docs.flatMap(doc => doc.topics.map(t => ({ ...doc, topic: t })))
  const docsByTopic = d3.groups(expandedDocs, d => d.topic.topic) // [<topic>, [<doc>, <doc>, …], …]

  const minTopics = 2,
    maxTopics = 5

  /** @type {number[]} */
  let selectedTopics = $state([])
  let generating = $state(false)
  let timeElapsed = $state(0)

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


  let windowWidth = $state(window.innerWidth)
  let windowHeight = $state(window.innerHeight)

  const padding = {top: 32, bottom: 32, left: 48, right: 48 }

  const xScale = $derived(
    d3.scaleLinear()
      .domain(d3.extent(data.docs.map(doc => doc.x)))
      .range([padding.left, window.innerWidth - padding.right])
  )

  const yScale = $derived(
    d3.scaleLinear()
      .domain(d3.extent(data.docs.map(doc => doc.y)))
      .range([padding.top, window.innerHeight - padding.bottom])
  )

  const path = d3.geoPath().pointRadius(1)

  const topicContour = index =>
    d3.contourDensity()
      .size([window.innerWidth, window.innerHeight])
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .contours(docsByTopic.find(e => e[0] === index)?.[1])

</script>

<svelte:window
  bind:innerWidth={windowWidth}
  bind:innerHeight={windowHeight}
/>

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
      <svg id="scatter" class="scatter" width={windowWidth} height={windowHeight}>
      {#snippet blob(contour)}
        {#each d3.ticks(Number.MIN_VALUE, contour.max, 20) as value}
          <path class="contour" d={path(contour(value))} />
        {/each}
      {/snippet}
      {#each selectedTopics as topic}
        {@render blob(topicContour(topic))}
      {/each}
        <g>
          {#each data.docs as doc}
            <circle cx={xScale(doc.x)} cy={yScale(doc.y)} r="4" />
          {/each}
        </g>
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

.scatter .contour {
  stroke: none;
  fill: var(--lime-20);
}
</style>
