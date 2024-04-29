import 'fs'
import path from "path";
import getRequestData from './getRequestData.js';
import * as logger from "tracer"
import funkcje_JSON, { zdjecia_dane } from './jsonController.js';

const imageRouter = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url == "/api/photos") {
                res.write(JSON.stringify(zdjecia_dane, 5, null))
                res.end()
            }
            if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
                let url = req.url.split("photos")
                let szukane_id = url[1]
                szukane_id = szukane_id.substring(1)
                console.log(szukane_id);
                let szukane_zdjecie = zdjecia_dane.filter((zdjecie) => zdjecie.id == szukane_id)
                if (szukane_zdjecie[0]) {
                    res.write(JSON.stringify(szukane_zdjecie[0], 5, null))
                    res.end()
                } else {
                    res.write("Zdjęcie nie istnieje")
                    res.end()
                }
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
                let splitowany_stary_upload = dane["files"]["file"]["path"].split("\\")
                // console.log(dane);
                let nazwa_albumu = dane["fields"]["album"]
                splitowany_stary_upload.splice(1, 0, nazwa_albumu)

                let nowy_upload = splitowany_stary_upload.join("\\")
                funkcje_JSON.dodaj_zdjecie(dane["fields"], dane["files"], nowy_upload)
                console.log("DANE: " + JSON.stringify(zdjecia_dane, 5, null));
                res.write("CO")
                res.end()

            }
            break
        case "DELETE":
            if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
                let url = req.url.split("photos")
                let szukane_id = url[1]
                szukane_id = szukane_id.substring(1)
                console.log(szukane_id);
                let szukane_zdjecie = zdjecia_dane.filter((zdjecie) => zdjecie.id == szukane_id)[0]
                let index = zdjecia_dane.indexOf(szukane_zdjecie)
                if (index != -1) {
                    zdjecia_dane.splice(index, 1)
                    res.write("Usunieto zdjecie o id: " + szukane_id)
                    res.end()
                } else {
                    res.write("Zdjęcie do usuniecia nie istnieje")
                    res.end()
                }
            }
            break
        case "PATCH":
            if (req.url.match(/\/api\/photos\/([0-9]+)\/tags/)) {
                let url_split = req.url.split("/")
                let szukane_id = url_split[3]
                res.write(szukane_id)
                res.end()
            }
            else if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
                let url = req.url.split("photos")
                let szukane_id = url[1]
                szukane_id = szukane_id.substring(1)
                let szukane_zdjecie = zdjecia_dane.filter((zdjecie) => zdjecie.id == szukane_id)[0]
                let index = zdjecia_dane.indexOf(szukane_zdjecie)
                if (index != -1) {
                    funkcje_JSON.Patch_zdjecie(index)
                    res.write("Zaktualizowano zdjęcie o id " + index)
                    res.end()
                } else {
                    res.write("Zdjecie do aktualizacji nie istnieje")
                    res.end()
                }
            }

    }
}

export default imageRouter