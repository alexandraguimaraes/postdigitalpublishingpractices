<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
</script>

<h1>{data?.title}</h1>
<h2>Summary</h2>
<p>{data?.summary}</p>
<p>Topics: {data?.topics.join(', ')}</p>
<hr>
{#each data?.docs as doc}
<p>{doc.Document}</p>
{/each}
