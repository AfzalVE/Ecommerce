import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env.ELASTICSEARCH_URL, // e.g. https://xxxx.es.io

  auth: {
    apiKey: process.env.ELASTIC_API_KEY, // 🔥 THIS is required
  },
});

export default client;