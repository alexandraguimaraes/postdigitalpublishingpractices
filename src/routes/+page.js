import topics from '$lib/data/6_topics_main_representation.json'
import docs from '$lib/data/7_docs.json';

export async function load() {
  return {
    topics: topics
      .filter((t) => t.topic >= 0)
      .map((t) => ({
        id: t.topic,
        main: t.main_representation[0],
        terms: t.representation
      })),
    docs: docs.map(doc => ({ ...doc, x: doc.x * 100, y: doc.y * 100 }))
  }
}
