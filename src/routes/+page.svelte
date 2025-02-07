<script>
  import { goto } from '$app/navigation';
  const { data } = $props();

  const minTopics = 2,
    maxTopics = 5;

  /** @type {number[]} */
  let selectedTopics = $state([]);
  let generating = $state(false);

  /**
     * @param {SubmitEvent} event
     */
  async function onGenerate(event) {
    try {
      generating = true;
      event.preventDefault()
      const query = new URLSearchParams()
      selectedTopics.forEach(topic => query.append('t', String(topic)))
      await goto(`/publication?${query.toString()}`)
    } finally {
      generating = false;
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
  <p>generating...</p>
{/if}
