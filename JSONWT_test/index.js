import { createServer } from 'http';
import router from "./JSONWT_router.js";
import 'dotenv/config'

let PORT = process.env.APP_PORT
createServer((req, res) => router(req, res))
    .listen(PORT, () => console.log("listen on " + PORT))