import topics from '$lib/data/topics.json'
import docs from '$lib/data/7_docs.json';

export async function load() {
  return {
    topics: topics
      .filter((t) => t.Topic >= 0)
      .map((t) => ({
        id: t.Topic,
        terms: t.Representation
      })),
    docs: docs.map(doc => ({ ...doc, x: doc.x * 100, y: doc.y * 100 }))
  }
}
