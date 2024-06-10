import formidable from "formidable";
import path from "path";
import Funkcje_Plikow from "../controllers/fileController.js";


let __dirname = path.resolve()
const getRequestData = async (req, nazwa_albumu) => {

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
                await Funkcje_Plikow.Stworz_album(path.join(__dirname, "uploads"), nazwa_albumu)
                await Funkcje_Plikow.Przenies_plik(__dirname, files["file"]["path"], nazwa_albumu)
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

export const upload_profile_picture = async (req, album) => {
    return new Promise((resolve, reject) => {
        try {
            let form = formidable({});

            form.uploadDir = 'uploads'
            form.keepExtensions = true;
            form.parse(req, async function (err, fields, files) {
                console.log(Object.keys(files["files"]));
                let split_path = files["files"]["path"].split("\\")
                let name = split_path.pop()
                split_path.push(album)
                let extension = name.split(".")[1]
                split_path.push("profile." + extension)
                split_path.join("/")
                await Funkcje_Plikow.Upload_profile_picture(__dirname, files["files"]["path"], split_path)
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