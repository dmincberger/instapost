import 'fs'
import getRequestData from '../tools/getRequestData.js';
import funkcje_JSON, { zdjecia_dane } from '../controllers/jsonController.js';
import { funkcje_tagow, wszystkie_tagi } from '../controllers/tagsController.js';
import token_functions from "../controllers/JSONWT_controller.js"

const imageRouter = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/)) {
                let url_split = req.url.split("/")
                let szukane_id = url_split[4]
                let szukane_zdjecie_array = zdjecia_dane.filter((element) => element["id"] == szukane_id)
                if (szukane_zdjecie_array.length != 0) {
                    let szukane_zdjecie = szukane_zdjecie_array[0]
                    let tagi_zdjecia = szukane_zdjecie["tags"]
                    res.write(JSON.stringify(tagi_zdjecia))
                    res.end()
                    break
                } else {
                    res.write("Nie ma takiego zdjecia")
                    res.end()
                    break
                }
            }

            else if (req.url == "/api/photos") {
                res.write(JSON.stringify(zdjecia_dane, 5, null))
                res.end()
                break
            }

            // #############################################################################################################

            else if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
                let url = req.url.split("photos")
                let szukane_id = url[1]
                szukane_id = szukane_id.substring(1)
                console.log(szukane_id);
                let szukane_zdjecie = zdjecia_dane.filter((zdjecie) => zdjecie.id == szukane_id)
                if (szukane_zdjecie[0]) {
                    res.write(JSON.stringify(szukane_zdjecie[0], 5, null))
                    res.end()
                    break
                } else {
                    res.write("Zdjęcie nie istnieje")
                    res.end()
                    break
                }
            }
            else if (req.url == "/api/photos") {
                res.write(JSON.stringify(zdjecia_dane, 5, null))
                res.end()
                break
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
                let token = req.headers.authorization.split(" ")[1]
                let decoded_token = token_functions.verify_token(token)
                let email = decoded_token["email"]
                let nazwa_albumu = email
                let dane = await getRequestData(req, nazwa_albumu) // dostaje obiekt fields: fields, files: files
                let splitowany_stary_upload = dane["files"]["file"]["path"].split("\\")
                // console.log(dane);
                splitowany_stary_upload.splice(1, 0, nazwa_albumu)

                let nowy_upload = splitowany_stary_upload.join("\\")
                funkcje_JSON.dodaj_zdjecie(nazwa_albumu, dane["files"], nowy_upload)
                console.log("DANE: " + JSON.stringify(zdjecia_dane, 5, null));
                res.write("POSTED")
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
            if (req.url.match(/\/api\/photos\/([0-9]+)\/tags\/mass/)) {
                let dane = await funkcje_tagow.zdobadz_dane(req)
                console.log(JSON.stringify(dane));
                let dane_parsed = JSON.parse(dane)
                let dodawane_tagi = dane_parsed["tags"]
                let url_split = req.url.split("/")
                let szukane_id = url_split[3]
                let szukane_zdjecie = zdjecia_dane.filter((zdjecie) => zdjecie["id"] == szukane_id)[0]
                if (szukane_zdjecie) {
                    let index = zdjecia_dane.indexOf(szukane_zdjecie)
                    dodawane_tagi.forEach(tag => {
                        let dodawany_tag = tag["name"]
                        if (!szukane_zdjecie["tags"].includes(dodawany_tag)) {
                            szukane_zdjecie["tags"].push(dodawany_tag)
                            if (!wszystkie_tagi.includes(dodawany_tag)) {
                                funkcje_tagow.dodaj_tag(dodawany_tag)
                            }
                        }
                    });
                    funkcje_JSON.Aktualizacja_zdjecia(szukane_zdjecie, index)
                    res.write("szukane zdjecie o id " + szukane_id + " zostalo zaktualizowane o podana tablice tagow: " + JSON.stringify(dane))
                } else {
                    res.write("Nie ma zdjecia o takim id")
                    res.end()
                    break
                }
            }
            else if (req.url.match(/\/api\/photos\/([0-9]+)\/tags/)) {
                let dane = await funkcje_tagow.zdobadz_dane(req)
                let dane_parsed = JSON.parse(dane)
                let dodawany_tag = dane_parsed["name"]
                console.log("DODAWANY: " + dodawany_tag);
                let url_split = req.url.split("/")
                let szukane_id = url_split[3]
                let szukane_zdjecie_tablica = zdjecia_dane.filter((element) => element["id"] == szukane_id)
                let szukane_zdjecie = szukane_zdjecie_tablica[0]
                if (szukane_zdjecie_tablica.length == 0) {
                    res.write("Nie ma zdjecia o takim id")
                    res.end()
                    break
                }
                else if (wszystkie_tagi.includes(dodawany_tag) == false) {
                    res.write("Nie ma takiego tagu!")
                    res.end()
                    break
                }
                else if (szukane_zdjecie["tags"].includes(dodawany_tag)) {
                    res.write("Zdjecie juz posiada owy tag")
                    res.end()
                    break
                }
                else {
                    let index = zdjecia_dane.indexOf(szukane_zdjecie)
                    szukane_zdjecie["tags"].push(dodawany_tag)
                    funkcje_JSON.Aktualizacja_zdjecia(szukane_zdjecie, index)
                    res.write("Zdjecie o id " + szukane_id + " Zostalo zaktualizowane o tag " + dodawany_tag)
                    res.end()
                    break
                }
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
                    break
                } else {
                    res.write("Zdjecie do aktualizacji nie istnieje")
                    res.end()
                    break
                }
            }

    }
}

export default imageRouter