import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/authors.json")
const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/blogPosts.json")
const publicFolderPathAuthor = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/authors")
const publicFolderPathBlogPost = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/blogposts")

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)
export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = content => writeJSON(blogPostsJSONPath, content)

export const saveAuthorsPicture = (filename, contentAsBuffer) => writeFile(join(publicFolderPathAuthor, filename), contentAsBuffer)
export const saveBlogPostsCover = (filename, contentAsBuffer) => writeFile(join(publicFolderPathBlogPost, filename), contentAsBuffer)