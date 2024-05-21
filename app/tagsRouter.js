import 'fs'
import path from "path";
import getRequestData from './getRequestData.js';
import * as logger from "tracer"
import funkcje_JSON, { zdjecia_dane } from './jsonController.js';
import { wszystkie_tagi, tagi_popularność } from './tagsController.js';
import { funkcje_tagow } from './tagsController.js';

const tagsRouter = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url == "/api/tags/raw") {
                console.log(wszystkie_tagi);
                res.write(JSON.stringify(wszystkie_tagi))
                res.end()
                break
            }
            else if (req.url == "/api/tags") {
                let tagi = funkcje_tagow.get_tagi()
                res.write(JSON.stringify(tagi, 5, null))
                res.end()
                break
            }
            else if (req.url.match(/\/api\/tags\/\d+/)) {
                let url_rozbite = req.url.split("/")
                let numer_tagu = url_rozbite[3]
                if (wszystkie_tagi[numer_tagu] != undefined) {
                    let potrzebny_tag = {
                        "id": numer_tagu,
                        "name": wszystkie_tagi[numer_tagu],
                        "popularnosc": tagi_popularność[numer_tagu]
                    }
                    res.write(JSON.stringify(potrzebny_tag, 5, null))
                    res.end()
                    break
                } else {
                    res.write("Tag o takim id nie istnieje")
                    res.end()
                    break
                }
            }
        case "POST":
            if (req.url == "/api/tags") {
                let body = await funkcje_tagow.zdobadz_dane(req)
                let parsed_body = JSON.parse(body)
                let dodawany_tag = {
                    "name": parsed_body["name"],
                    "popularnosc": parsed_body["popularnosc"]
                }
                let odpowiedz = funkcje_tagow.dodaj_tag(parsed_body)
                console.log(odpowiedz);
                res.write(odpowiedz)
                res.end()
                break
            }

        case "PATCH":
    }
}

export default tagsRouter 