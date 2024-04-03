// import { parse } from 'dotenv'
import Blog from '../models/blog.model.js'
// import { errorHandler } from '../utils/error.js'
import nodemailer from "nodemailer";
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import { openai } from '../utils/openAi.js';
import { indexBlogPostInElasticsearch, searchBlogsAndGetIds } from '../utils/elasticSearch.js';

dotenv.config();

export const createBlog = async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body);
        console.log(blog)

        // Notify subscribers right after the blog post is created successfully
        notifySubscribers(blog)
        .then(() => {
            console.log('Subscribers notified');
        })
        .catch(error => {
            // Log the error but do not disrupt the blog creation flow
            console.error('Error notifying subscribers:', error);
        });

        await indexBlogPostInElasticsearch(blog);

        return res.status(201).json(blog);
        
    } catch (error) {
        next(error);
    }
};

//getting all blogs
export const getBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find()
        return res.status(200).json(blogs)

    } catch (error){
        next(error)
    }
}

// Creating a comment
export const createComment = async (req, res, next) => {
    // Assuming the blog post ID, text, and userName are passed in the request body
    const { _id: blogPostId, text, userName } = req.body;

    try {
        // Find the blog post by its ID and update it by adding the new comment to the comments array
        const updatedBlogPost = await Blog.findByIdAndUpdate(
            blogPostId,
            { $push: { comments: { text, userName } } },
            { new: true, runValidators: true } // Options to return the updated document and run schema validators
        );

        if (!updatedBlogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Send back the updated blog post document with the new comment
        res.status(200).json(updatedBlogPost);
    } catch (error) {
        console.error('Error adding comment to blog post:', error);
        // Pass the error to the next middleware (e.g., an error handler)
        next(error);
    }
};


//deleting a blog
export const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (!blog) {
            return res.status(404).json('Blog not found')
        }

         

        return res.status(200).json('Blog deleted successfully')
    } catch (error) {
        next(error)
    }

}


// Set up your transporter
const transporter = nodemailer.createTransport(
    // Configuration depending on your email service
    {
        service: 'gmail',
        port: 587, // Commonly, 587 for TLS or 465 for SSL
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    }
  );


 const notifySubscribers = async (post) => {
    const subscribers = await User.find({ subscriptions: post.topic });
    console.log('subscribers', subscribers);
  
    subscribers.forEach(subscriber => {
      transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: subscriber.email,
        subject: `There's something new! from IIT Chicago Blog in ${post.topic}`,
        text: `Greetings, 

Dive into our newest post! We're revealing something exciting in the ${post.topic} section:

${post.title}

${post.content}

`, 
    html: `<p>Greetings,</p>
           <p>Dive into our newest post! We're revealing something exciting in the <strong>${post.topic}</strong> section:</p>
           <h2>${post.title}</h2>
           <p>${post.content}</p>
           `, 
  }, (error, info) => {
        if (error) {
          console.error(`Failed to send email to ${subscriber.email}`, error);
        } else {
          console.log(`Email sent to ${subscriber.email}: ${info.response}`);
        }
      });
    });
  }

 


  const trimToLastCompleteSentence = (text) => {
    // Simple regex to match the last sentence ending with a period, question mark, or exclamation mark
    const sentences = text.match(/[^.!?]*[.!?]/g);

    if (sentences && sentences.length > 0) {
        // Join the sentences back together
        return sentences.join(' ');
    }

    return text; // Return the original text if no sentence endings were found
}


  export const generateComment = async (req, res, next) => {
    const { _id: blogPostId } = req.body;

    if (!blogPostId) {
        return res.status(400).json({ message: 'Blog post ID is required.' });
        
      }
      try {
        // Fetch the blog post from the database
        const post = await Blog.findById(blogPostId);
    
        if (!post) {
          return res.status(404).json({ message: 'Blog post not found.' });
        }

        console.log(post)
    
        // Generate a comment using OpenAI's API based on the blog post's content
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-16k",
          messages:[{ role:'user', content:`Given the following blog post content, generate a thoughtful comment:\n\n"${post.content}"`}] ,
          temperature: 0.7,
          max_tokens: 50,
        });
        console.log(response.choices[0].message.content)

    
        const comment = response.choices[0].message.content;
        
        
        // Example usage with the response from OpenAI
        const trimmedComment = trimToLastCompleteSentence(comment);
    
        res.status(200).json({ trimmedComment });
      } catch (error) {
        console.error('Error generating comment:', error);
        res.status(500).json({ message: 'Failed to generate comment.' });
      }
    }

export const searchBlogs = async (req, res, next) => {
  const { query } = req.body;

  try {
    // Assume searchBlogsAndGetIds returns an array of IDs from Elasticsearch
    const blogIds = await searchBlogsAndGetIds(query);
    console.log('Elasticsearch IDs:', blogIds);

    if (!blogIds.length) {
      return res.status(404).json({ message: 'No matching blogs found' });
    }
    const blogs = await Blog.find({ '_id': { $in: blogIds } });

    return res.status(200).json(blogs);
  } catch (error) {
    console.error('Error searching blogs:', error);
    next(error);
  }
};
