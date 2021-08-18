import express from "express"
import cors from "cors"
import authorsRouter from "./services/authors/index.js"
import listEndpoints from "express-list-endpoints"
import blogPostsRouter from "./services/blogPosts/index.js"
import filesRouter from "./services/files/index.js"
import { join } from "path"

const server = express();
const port = process.env.PORT;
//console.log(process.env)
const publicFolderPath = join(process.cwd(), "public")

const whitelist= [process.env.FE_DEV_URL, process.env.FE_PROD_URL] // what frontends are allowed

const corsOpts = {
  origin: function(origin, next){
    console.log('ORIGIN --> ', origin)
    if(whitelist.indexOf(origin) !== -1){ // if received origin is in the whitelist I'm going to allow that request
      next(null, true) //no error
    }else{ // if it is not, I'm going to reject that request
      next(new Error(`Origin ${origin} not allowed!`))
    }
  }
}


// ***************** MIDDLEWARES *******************************

const loggerMiddleware = (request, response, next) => {
  //console.log(`Request method ${request.method} -- Request URL ${request.url} -- ${new Date()}`)
  next() 
}

// GLOBAL LEVEL MIDDLEWARES
server.use(loggerMiddleware)
server.use(express.static(publicFolderPath))
server.use(cors(corsOpts))
server.use(express.json()) //this comes before the routes
server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)
server.use("/files", filesRouter)

console.table(listEndpoints(server))
server.listen(port, () => {
  console.log(`Server running at ${port}/`);
});