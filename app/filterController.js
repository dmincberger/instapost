import sharp from 'sharp';
import path from "path";
const filter_functions = {
    get_metadata: async function (server_image_path) {
        return new Promise(async (resolve, reject) => {
            try {

                if (server_image_path) {
                    let meta = await sharp(server_image_path)
                        .metadata()
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    filter_photo: async function (server_image_path, filter) {
        switch (filter) {
            case "rotate":
                return new Promise(async (resolve, reject) => {
                    let new_photo_path = server_image_path + "-rotate.jpg"
                    let filtered_photo = await sharp(server_image_path)
                        .rotate(90)
                        .toFile(new_photo_path)
                    resolve(new_photo_path)
                })
            case "resize":
                return new Promise(async (resolve, reject) => {
                    let new_photo_path = server_image_path + "-resize.jpg"
                    let filtered_photo = await sharp(server_image_path)
                        .resize({
                            width: 159,
                            height: 100
                        })
                        .toFile(new_photo_path)
                    resolve(new_photo_path)
                })
            case "reformat":
                return new Promise(async (resolve, reject) => {
                    let new_photo_path = server_image_path + "-reformat.png"
                    let filtered_photo = await sharp(server_image_path)
                        .toFormat("png")
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
            case "crop":
                return new Promise(async (resolve, reject) => {
                    let new_photo_path = server_image_path + "-crop.png"
                    let filtered_photo = await sharp(server_image_path)
                        .extract({ width: 200, height: 200, left: 20, top: 20 })
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
            case "grayscale":
                return new Promise(async (resolve, reject) => {
                    let new_photo_path = server_image_path + "-grayscale.png"
                    let filtered_photo = await sharp(server_image_path)
                        .grayscale()
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
            case "negate":
                return new Promise(async (resolve, reject) => {
                    let new_photo_path = server_image_path + "-negate.png"
                    let filtered_photo = await sharp(server_image_path)
                        .negate()
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
            case "tint":
                return new Promise(async (resolve, reject) => {
                    let new_photo_path = server_image_path + "-negate.png"
                    let filtered_photo = await sharp(server_image_path)
                        .tint({ r: 255, g: 0, b: 0 })
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
        }
    }
}

export default filter_functions
