// ----------------------------- blogPosts CRUD ---------------------
import express from "express"
/* import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path" */
import uniqid from "uniqid"
import { blogPostsValidationMiddleware } from "./validation.js"
import { validationResult } from "express-validator"
import { getBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js"

// To obtain blogPosts.json file path
/* const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json") */

const blogPostsRouter = express.Router()

/* const getblogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeblogPosts = content => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content)) */

const anotherLoggerMiddleware = (request, response, next) => {
    // route middleware
    next()
  }

// GET /blogPosts => returns the list of blogposts
// GET /blogPosts?title=whatever => filter the blogposts and extract the only that match the condition (es.: title contains "whatever")
blogPostsRouter.get("/", anotherLoggerMiddleware, async (request, response, next) => {
    try {
        const blogPosts = await getBlogPosts()
        if (request.query && request.query.category) {
            const filteredBlogPosts = blogPosts.filter(
                (b) => b.category === request.query.category
              );
        response.send(filteredBlogPosts);
    } else {
        response.send(blogPosts)
    }
    } catch (error) {
        next(error)
    }    
})

// GET /blogPosts /123 => returns a single blogpost
blogPostsRouter.get("/:blogID", async (request, response, next) => {
    try {       
    const blogPosts = await getBlogPosts()
    const blogPost = blogPosts.find(b => b.id === request.params.blogID)
    response.send(blogPost)
    } catch (error) {
        next(error)
    }
})

// POST /blogPosts => create a new blogpost
blogPostsRouter.post("/", blogPostsValidationMiddleware, async (request, response, next) => {
    try {  
    const errorsList = validationResult(request)   

    if (!errorsList.isEmpty()) {
        next(errorsList)
    } else {
    const newBlogPost = { ...request.body, id: uniqid(), createdAt: new Date()}
    const blogPosts = await getBlogPosts()
    blogPosts.push(newBlogPost)
    await writeBlogPosts(blogPosts)
    response.status(201).send({ id: newBlogPost.id })
    }
    } catch (error) {
        next(error)
  }
})

// PUT /blogPosts /123 => edit the blogpost with the given id
blogPostsRouter.put("/:blogID", async (request, response, next) => {
    try {       
    const blogPosts = await getBlogPosts()
    const updatedBlogPost = { ...request.body, id: request.params.blogID }
    const remainingBlogPosts = blogPosts.filter(blogPost => blogPost.id !== request.params.blogID)
    remainingBlogPosts.push(updatedBlogPost)

    await writeBlogPosts(remainingBlogPosts)
    response.send(updatedBlogPost)
    } catch (error) {
        next(error)
    }
})

// DELETE /blogPosts /123 => delete the blogpost with the given id
blogPostsRouter.delete("/:blogID", async (request, response, next) => {
    try {       
    const blogPosts = await getBlogPosts()
    const remainingBlogPosts = blogPosts.filter(blogPost => blogPost.id !== request.params.blogID)
        
    await writeBlogPosts(remainingBlogPosts)
    response.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default blogPostsRouter