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

            form.parse(req, async function (err, fields, files) {
                await Funkcje_Plikow.Stworz_album(path.join(__dirname, "uploads"), fields["album"])
                await Funkcje_Plikow.Przenies_plik(__dirname, files["file"]["path"], fields["album"])
                console.log("----- przesłane pola z formularza ------");

                // console.log(fields);

                console.log("----- przesłane formularzem pliki ------");

                // console.log(files);

                return { fields: fields, files: files } // zwracam fields i files
            });
        } catch (error) {
            reject(error);
        }
    })

}
export default getRequestData