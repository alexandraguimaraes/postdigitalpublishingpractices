export const prerender = false

import docs from '$lib/data/docs.json'
import { pipeline } from '@huggingface/transformers'

// const [generate, summarize] = await Promise.all([
//   pipeline('text-generation', 'Xenova/distilgpt2'),
//   pipeline('summarization', 'Xenova/bart-large-cnn')
// ])
// const summarize = await pipeline('summarization', 'Xenova/bart-large-cnn')

// /** @type {import('./$types').PageServerLoad} */
// export async function load() {
  // }
  
  const deviationFromAvg = 3
  const approxExcerpts = random(30, 50)
  
  export async function load({ url }) {
  const summarize = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6')
  
  const topics = url.searchParams.getAll('t').map(t => Number(t))
  // /** @type {FormData} */
  // const data = await request.formData();
  // const topics = data.getAll('topic').map(t => Number(t));
  
  const topicDocs = docs
    .filter(doc => topics.includes(doc.Topic))
    .reduce((acc, doc) => {
      acc[doc.Topic] ??= []
      acc[doc.Topic].push(doc)
      return acc
    }, {})

  const topicNames = topics.map(t => topicDocs[t][0].Representation[0])
  console.log(topicNames)
  

  const avgDocsPerTopic = Math.floor(approxExcerpts / topics.length)
  const docsPerTopic = topics.map(t => Math.min(
    topicDocs[t].length,
    // avgDocsPerTopic
    random(avgDocsPerTopic - deviationFromAvg, avgDocsPerTopic + deviationFromAvg)
  ))
  
  const res = []
  for (const [index, topic] of topics.entries()) {
    let numDocs = docsPerTopic[index]
    while (numDocs-- > 0) {
      const el = popRandom(topicDocs[topic])
      if (!el) break
      res.push(el) 
    }
  }

  const text = 
    shuffle([...res])
    // .slice(0, 5)
    .map(doc => doc.Document)
    .join('\n')
  const summaryResult = await summarize(text, { temperature: 0.4, max_time: 10, min_length: 13000 })
  // const summary = await summarize(res, { temperature: 0, max_time: 7 })
  console.log(summaryResult)
  const summary = summaryResult[0].summary_text
  const titleResult = await summarize(summary, { max_length: 20 })
  console.log(titleResult)
  const title = titleResult[0].summary_text

  return { topics: topicNames, title, summary, docs: res }
}


function random(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function popRandom(array) {
  const index = random(0, array.length - 1)
  const [item] = array.splice(index, 1)
  return item
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array
}