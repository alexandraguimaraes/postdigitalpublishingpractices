import topics from '$lib/data/topics.json'
// import docs from '$lib/data/topics.json';

export async function load() {
  return {
    topics: topics
      .filter((t) => t.Topic >= 0)
      .map((t) => ({
        id: t.Topic,
        terms: t.Representation
      }))
  }
}
