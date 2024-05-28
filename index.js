import { createServer } from 'http';
import imageRouter from "./app/routers/imageRouter.js";
import tagsRouter from './app/routers/tagsRouter.js'
import filterRouter from './app/routers/filterRouter.js';
import image_get_Router from './app/routers/imagegetRouter.js';
import user_router from './app/routers/userRouter.js';
let PORT = 3000
createServer(async (req, res) => {

    //images

    if (req.url.search("/api/photos") != -1) {
        await imageRouter(req, res)
    }

    //tags

    else if (req.url.search("/api/tags") != -1) {
        await tagsRouter(req, res)
    } else if (req.url.search("/api/filters") != -1) {
        await filterRouter(req, res)
    } else if (req.url.search("/api/getimage") != -1) {
        await image_get_Router(req, res)
    } else if (req.url.search("/api/user") != -1) {
        await user_router(req, res)
    }

})
    .listen(PORT, () => console.log("listen on 3000"))
