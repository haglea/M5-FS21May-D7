/* ---------------- PUT /files/upload ----------------  */

import express from "express"
import multer from "multer"
import { getAuthors, writeAuthors, saveAuthorsPicture, getBlogPosts, writeBlogPosts, saveBlogPostsCover } from "../../lib/fs-tools.js"
import { extname } from "path"

const filesRouter = express.Router()

// PUT /files/:aID/uploadAvatar
filesRouter.put("/:aID/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
  try {
    console.log(req.file)
    const authors = await getAuthors()
    const authorIndex = authors.findIndex(
        (author) => author.id === req.params.aID
      );
      console.log(authorIndex)
      if (!authorIndex == -1) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.aID} is not found!` });
      }
    const previousAuthorData = authors[authorIndex];
    const fileName = `${req.params.aID}${extname(req.file.originalname)}`
    
    const updatedAuthor = { 
        ...previousAuthorData, 
        avatar: `http://localhost:3001/img/authors/${fileName}`, 
        updatedAt: new Date(), 
        id: req.params.aID 
    }
    authors[authorIndex] = updatedAuthor;
    await saveAuthorsPicture(fileName, req.file.buffer)    
    
    const remainingAuthors = authors.filter(author => author.id !== req.params.aID)
    remainingAuthors.push(updatedAuthor)

    await writeAuthors(remainingAuthors)    
    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

// PUT /files/:blogPostID/uploadCover
filesRouter.put("/:blogPostID/uploadCover", multer().single("cover"), async (req, res, next) => {
  try {
    console.log(req.file)
    const blogPosts = await getBlogPosts()
    const blogPostIndex = blogPosts.findIndex(
        (b) => b.id === req.params.blogPostID
      );
      console.log(blogPostIndex)
      if (!blogPostIndex == -1) {
        res
          .status(404)
          .send({ message: `Blog post with ${req.params.blogPostID} is not found!` });
      }
    const previousBlogPostData = blogPosts[blogPostIndex];
    const fileName = `${req.params.blogPostID}${extname(req.file.originalname)}`
    
    const updatedBlogPost = { 
        ...previousBlogPostData, 
        cover: `http://localhost:3001/img/blogposts/${fileName}`, 
        updatedAt: new Date(), 
        id: req.params.blogPostID 
    }
    blogPosts[blogPostIndex] = updatedBlogPost;
    await saveBlogPostsCover(fileName, req.file.buffer)    
    
    const remainingBlogPosts = blogPosts.filter(b => b.id !== req.params.blogPostID)
    remainingBlogPosts.push(updatedBlogPost)

    await writeBlogPosts(remainingBlogPosts)    
    res.send(updatedBlogPost)
  } catch (error) {
    next(error)
  }
})

export default filesRouter