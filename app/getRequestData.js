import formidable from "formidable";
import path from "path";
import Funkcje_Plikow from "./fileController.js";
import * as fs from 'fs'





let __dirname = path.resolve()
const getRequestData = async (req) => {

    return new Promise((resolve, reject) => {
        try {
            let form = formidable({});

            form.uploadDir = 'uploads'
            form.keepExtensions = true;
            form.parse(req, async function (err, fields, files) {
                let split_path = files["file"]["path"].split("\\")
                split_path.pop()
                split_path.push(files["file"]["name"])
                split_path.join("\\")
                await Funkcje_Plikow.Stworz_album(path.join(__dirname, "uploads"), fields["album"])
                await Funkcje_Plikow.Przenies_plik(__dirname, files["file"]["path"], fields["album"])
                // console.log("----- przesłane pola z formularza ------");

                // console.log(fields);

                // console.log("----- przesłane formularzem pliki ------");

                // console.log(files);
                console.log("ZROBILES SIE?");
                resolve({ fields: fields, files: files }) // zwracam fields i files
            });
        } catch (error) {
            reject(error);
        }
    })

}

export const get_body_data = async (req) => {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (data) => {
            body += data.toString();
        })

        req.on("end", (data) => {
            resolve(body)
        })
    })

}

export default getRequestData