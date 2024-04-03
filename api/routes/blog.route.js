import express from 'express';
import { createBlog, getBlogs, createComment, deleteBlog, generateComment, searchBlogs } from '../controllers/blog.controller.js';
import { get } from 'mongoose';

const router = express.Router();

router.post('/create', createBlog)
router.get('/get', getBlogs)
router.post('/comment', createComment)
router.delete('/delete/:id', deleteBlog)
router.post('/generatecomment', generateComment)
router.post('/searchblog', searchBlogs)

export default router