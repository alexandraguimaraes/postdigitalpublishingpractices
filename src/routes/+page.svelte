<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  const { data } = $props();

  const minTopics = 2,
    maxTopics = 5;

  /** @type {number[]} */
  let selectedTopics = $state([]);
  let generating = $state(false);

  function onGenerate() {
    generating = true;
    return async ({ update, action }) => {
      generating = false;
      await goto(action);
      await update();
    };
  }
</script>

<h1>Postdigital Publishing Practices: on Hybrid and Processual Print</h1>
<p>Select {minTopics} to {maxTopics} topics to generate a publication</p>

<form method="POST" action="/publication" use:enhance={onGenerate}>
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
