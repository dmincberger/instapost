import 'fs'
import path from "path";
import getRequestData from './getRequestData.js';
import tracer from "tracer"
import dodaj_zdjecie from './jsonController.js';

const router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url == "/api/photos") {

            }
            break;

        case "POST":
            // if (request.url == "/addone") {
            //     let dane = await getRequestData(request) // dostaje dane z posta
            //     console.log(JSON.parse(dane))
            //     // let nazwa = dane["nazwa"]
            //     // let kolor = dane["kolor"]
            //     // console.log("NAZWA: " + nazwa);
            //     // console.log("kolor: " + kolor);
            if (req.url == "/api/photos") {
                let dane = await getRequestData(req) // dostaje obiekt fields: fields, files: files
                // dodaj_zdjecie(fields, files)
                res.end()
            }
    }
}

export default router