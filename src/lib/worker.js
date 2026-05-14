import topics from '$lib/data/6_topics_main_representation.json'
import docs from '$lib/data/7_docs.json'
import { pipeline } from '@huggingface/transformers'

// const [generate, summarize] = await Promise.all([
//   pipeline('text-generation', 'Xenova/distilgpt2'),
//   pipeline('summarization', 'Xenova/bart-large-cnn')
// ])
// const summarize = await pipeline('summarization', 'Xenova/bart-large-cnn')
const summarizePromise = pipeline('summarization', 'Xenova/distilbart-cnn-12-6')
// const summarizePromise = pipeline('summarization', 'Xenova/distilbart-xsum-12-1')
const generateTitlePromise = pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M')

onmessage = (e) => {
  console.log(e.data)
  const { topics } = e.data
  generate(topics).then((res) => {
    postMessage(res)
  })
}

/**
 * @typedef {Object} Doc
 * @property {number} index
 * @property {string} excerpt
 */

/**
 * @typedef {Object} TopicsMapValue
 * @property {number} index
 * @property {string} mainRepresentation
 * @property {Doc[]} docs
 */

/**
 * @type {Map<string, TopicsMapValue>}
 */
const topicsMap = new Map()
topics.forEach(t => {
  topicsMap.set(t.topic, {
    index: t.topic,
    mainRepresentation: t.main_representation[0],
    docs: []
  })
})

docs.forEach(doc => {
  doc.topics.forEach(t => {
    const topic = topicsMap.get(t.topic)
    topic.docs.push({
      index: doc.index,
      excerpt: doc.excerpt
    })
  })
})

const deviationFromAvg = 3
const approxExcerpts = random(30, 50)

/**
 * 
 * @param {String[]} topicIndexes 
 * @returns 
 */
async function generate(topicIndexes) {
  /**
   * @type {TopicsMapValue[]}
   */
  const selectedTopics = topicIndexes.map(index => topicsMap.get(index))

  const topicNames = selectedTopics.map(topic => topic.mainRepresentation)
  console.log(topicNames)

  const avgDocsPerTopic = Math.floor(approxExcerpts / topicIndexes.length)
  const docsPerTopic = selectedTopics.map((t) =>
    Math.min(
      t.docs.length,
      // avgDocsPerTopic
      random(avgDocsPerTopic - deviationFromAvg, avgDocsPerTopic + deviationFromAvg)
    )
  )

  const res = []
  for (const [i, topic] of selectedTopics.entries()) {
    let numDocs = docsPerTopic[i]
    while (numDocs-- > 0) {
      const el = popRandom(topic.docs)
      if (!el) break
      res.push(el)
    }
  }

  const text = res
    // const text = shuffle([...res])
    // .slice(0, 5)
    .map((doc) => doc.excerpt)
    .join('\n')

  const summarize = await summarizePromise

  // const summaryResult = await summarize(text, { max_time: 10 })
  const summaryResult = await summarize(text)
  // const summary = await summarize(text, { temperature: 0, max_time: 7 })
  console.log(summaryResult)
  const summary = summaryResult[0].summary_text

  const generateTitle = await generateTitlePromise
  const generateTitlePrompt = `Give me a title for a book with the following blurb:

${summary}`
  const titleResult = await generateTitle(generateTitlePrompt)
  const title = titleResult[0].generated_text
  // const titleResult = await summarize(summary, { max_time: 5, max_length: 20 })
  // console.log(titleResult)
  // const title = titleResult[0].summary_text

  return { topics: topicNames, title, summary, docs: res }
}

function random(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function popRandom(array) {
  const index = random(0, array.length - 1)
  const [item] = array.splice(index, 1)
  return item
}

function selectRandom(array) {
  const index = random(0, array.length - 1)
  return array[index]
}

function shuffle(array) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
