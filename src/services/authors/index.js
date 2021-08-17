// ----------------------------- authors CRUD ---------------------
import express from "express"
/* import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path" */
import uniqid from "uniqid"
import { getAuthors, writeAuthors, getBlogPosts } from "../../lib/fs-tools.js"


const authorsRouter = express.Router()

/* // To obtain authors.json file path I need to do:
// 1. I'll start from the current file I am in (index.js) obtaining the file path to it
const currentFilePath = fileURLToPath(import.meta.url)
// 2. I'll obtain the current folder index.js file is in (src/services/authors folder)
const currentDirPath = dirname(currentFilePath)
// 3. I'll concatenate folder path with authors.json
const authorsJSONPath = join(currentDirPath, "authors.json") */

// GET /authors => returns the list of authors 
authorsRouter.get("/", async (request, response, next) => {
    try {
    const authors = await getAuthors()
    response.send(authors)
    } catch (error) {
        next(error)
    }
})

// GET /authors/123 => returns a single author
authorsRouter.get("/:aID", async (request, response, next) => {
    try {
        const authors = await getAuthors()
        const author = authors.find(s => s.id === request.params.aID)
        response.send(author)
    } catch (error) {
        next(error)
    }
})

//  GET /authors/:id/blogPosts/ => get all the posts for an author with a given ID
authorsRouter.get("/:aID/blogPosts", async (request, response, next) => {
    try {
        const blogPosts = await getBlogPosts()
        const authorsBlogPosts = blogPosts.filter(b => b.aID === request.params.aID)
        response.send(authorsBlogPosts)
    } catch (error) {
        next(error)
    }
})
// POST /authors => create a new author
authorsRouter.post("/", async (request, response, next) => {
    try {
        const authors = await getAuthors()  
        const author = authors.find((a) => a.email === request.body.email)    
        if(!author) { // ! turns undefined(false) into true
        const newAuthor = { ...request.body, id: uniqid(), createdAt: new Date()} 
        authors.push(newAuthor)
        await writeAuthors(authors)
        response.status(201).send({ id: newAuthor.id })
    } else {
        response.status(400).send("Author with the same email already exists")
    }   
    } catch (error) {
        next(error)
    }
})

// PUT /authors/123 => edit the author with the given id
authorsRouter.put("/:aID", async (request, response, next) => {
    try {
        const authors = await getAuthors()
        const updatedAuthor = { ...request.body, id: request.params.aID }
        const remainingAuthors = authors.filter(a => a.id !== request.params.aID)
        remainingAuthors.push(updatedAuthor)

        await writeAuthors(remainingAuthors)
        response.send(updatedAuthor)
    } catch (error) {
        next(error)
    }
})

// DELETE /authors/123 => delete the author with the given id
authorsRouter.delete("/:aID", async (request, response, next) => {
    try {
        const authors = await getAuthors()
        const remainingAuthors = authors.filter(a => a.id !== request.params.aID)
    
        await writeAuthors(remainingAuthors)
        response.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default authorsRouter