import { createServer } from 'http';
import imageRouter from "./app/routers/imageRouter.js";
import tagsRouter from './app/routers/tagsRouter.js'
import filterRouter from './app/routers/filterRouter.js';
import image_get_Router from './app/routers/imagegetRouter.js';
import user_router from './app/routers/userRouter.js';
import profile_router from './app/routers/profileRouter.js';
import tests_router from './app/routers/testsRouter.js';

let PORT = 3000
createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    console.log("HELLO?: " + req.method);
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        if (req.url.search("/api/photos") != -1) {
            await imageRouter(req, res)
        }


        else if (req.url.search("/api/tags") != -1) {
            await tagsRouter(req, res)
        } else if (req.url.search("/api/filters") != -1) {
            await filterRouter(req, res)
        } else if (req.url.search("/api/getimage") != -1) {
            await image_get_Router(req, res)
        } else if (req.url.search("/api/profile") != -1) {
            await profile_router(req, res)
        }
    }
    if (req.url.search("/api/user") != -1) {
        await user_router(req, res)
    } else if (req.url.search("/api/tests") != -1) {
        await tests_router(req, res)
    } else if (!req.headers.authorization && !req.headers.authorization.startsWith("Bearer")) {
        res.setHeader("Content-Type", "text/plain")
        res.write("Nie masz dostępu do tego")
        res.end()
    }
})
    .listen(PORT, () => console.log("listen on 3000"))
