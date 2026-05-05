import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

async function run() {
  const segmenter = await pipeline('image-segmentation', 'briaai/RMBG-1.4');
  console.log('Pipeline loaded');
  const output = await segmenter('https://picsum.photos/200/300.jpg');
  console.log('Output is array:', Array.isArray(output));
  if (Array.isArray(output)) console.log(Object.keys(output[0]));
  else console.log(Object.keys(output));
}

run().catch(console.error);
