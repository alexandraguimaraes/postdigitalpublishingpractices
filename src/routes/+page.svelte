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

{#if generating}
  <p>generating... (started {timeElapsed}s ago)</p>
{/if}
