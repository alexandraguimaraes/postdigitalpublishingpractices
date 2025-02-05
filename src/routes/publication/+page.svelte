<script>
  /** @type {import('./$types').PageProps} */
  let { form } = $props();
</script>

<h1>{form?.title}</h1>
<h2>Summary</h2>
<p>{form?.summary}</p>
<p>Topics: {form?.topics.join(', ')}</p>
<hr>
{#each form?.docs as doc}
<p>{doc.Document}</p>
{/each}
