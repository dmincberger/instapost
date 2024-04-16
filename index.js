import { createServer } from 'http';
import router from "./app/router.js";

createServer((req, res) => router(req, res))
    .listen(3000, () => console.log("listen on 3000"))