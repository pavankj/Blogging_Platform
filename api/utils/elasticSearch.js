import {Client} from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();


const client = new Client({
    node: process.env.NODE_URL, // Elasticsearch endpoint
    auth: {
        apiKey: process.env.API_KEY,
      }
    
  })


export const indexBlogPostInElasticsearch = async(blogPost) => {
    try {
      await client.index({
        index: 'blogs', 
        id: blogPost._id.toString(),
        document: {
          title: blogPost.title,
          content: blogPost.content,
          author: blogPost.author,
          topic: blogPost.topic,
        },
      });
  
      console.log(`Blog post indexed in Elasticsearch with ID: ${blogPost._id}`);
    } catch (error) {
      console.error('Failed to index blog post in Elasticsearch:', error);
      // Depending on your application's needs, you might want to throw this error or handle it gracefully
    }
  }

 

const createBlogPostIndex = async() => {
    const indexName = 'blogs';
  
    const { body: indexExists } = await client.indices.exists({ index: indexName });
  
    if (!indexExists) {
      await client.indices.create({
        index: indexName,
        body: {
          settings: {
            number_of_shards: 1, // Example setting
            number_of_replicas: 1 // Example setting
          },
          mappings: {
            properties: {
              title: { type: 'text' },
              content: { type: 'text' },
              author: { type: 'text' },
              topic: { type: 'text' },
              // Define other fields and their data types
            }
          }
        }
      });
  
      console.log(`Index ${indexName} created.`);
    } else {
      console.log(`Index ${indexName} already exists.`);
    }
  }
  
 // search the blogs in the elastic search

  export const searchBlogsAndGetIds = async(query) => {
    try {
      const body  = await client.search({
        index: 'blogs',
        body: {
          query: {
            multi_match: {
              query,
              fields: ['title', 'author', 'content', 'topic'],
            }
          }
        }
      });
      console.log(body)
  
      const blogIds = body.hits.hits.map(hit => hit._id);
  
      return blogIds;
    } catch (error) {
      console.error('Failed to search blogs in Elasticsearch:', error);
      // Depending on your application's needs, you might want to throw this error or handle it gracefully
    }
 }