import sharp from 'sharp';
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
                    let split_path = server_image_path.split("\\")
                    let image_name = split_path[split_path.length - 1]
                    let split_name = image_name.split(".")
                    let extension = split_name.pop()
                    let joined_name = split_name.join(".")
                    split_path[split_path.length - 1] = joined_name + "-rotate." + extension
                    let new_photo_path = split_path.join("\\")
                        .rotate(90)
                        .toFile(new_photo_path)
                    resolve(new_photo_path)
                })
            case "resize":
                return new Promise(async (resolve, reject) => {
                    let split_path = server_image_path.split("\\")
                    let image_name = split_path[split_path.length - 1]
                    let split_name = image_name.split(".")
                    let extension = split_name.pop()
                    let joined_name = split_name.join(".")
                    split_path[split_path.length - 1] = joined_name + "-resize." + extension
                    let new_photo_path = split_path.join("\\")
                    let filtered_photo = await sharp(server_image_path)
                        .resize({
                            width: 159,
                            height: 100
                        })
                        .toFile(new_photo_path)
                    resolve(new_photo_path)
                })
            case "crop":
                return new Promise(async (resolve, reject) => {
                    let split_path = server_image_path.split("\\")
                    let image_name = split_path[split_path.length - 1]
                    let split_name = image_name.split(".")
                    let extension = split_name.pop()
                    let joined_name = split_name.join(".")
                    split_path[split_path.length - 1] = joined_name + "-crop." + extension
                    let new_photo_path = split_path.join("\\")
                    let filtered_photo = await sharp(server_image_path)
                        .extract({ width: 200, height: 200, left: 20, top: 20 })
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
            case "grayscale":
                return new Promise(async (resolve, reject) => {
                    let split_path = server_image_path.split("\\")
                    let image_name = split_path[split_path.length - 1]
                    let split_name = image_name.split(".")
                    let extension = split_name.pop()
                    let joined_name = split_name.join(".")
                    split_path[split_path.length - 1] = joined_name + "-grayscale." + extension
                    let new_photo_path = split_path.join("\\")
                    let filtered_photo = await sharp(server_image_path)
                        .grayscale()
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
            case "negate":
                return new Promise(async (resolve, reject) => {
                    let split_path = server_image_path.split("\\")
                    let image_name = split_path[split_path.length - 1]
                    let split_name = image_name.split(".")
                    let extension = split_name.pop()
                    let joined_name = split_name.join(".")
                    split_path[split_path.length - 1] = joined_name + "-negate." + extension
                    let new_photo_path = split_path.join("\\")
                    let filtered_photo = await sharp(server_image_path)
                        .negate()
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
            case "tint":
                return new Promise(async (resolve, reject) => {
                    let split_path = server_image_path.split("\\")
                    let image_name = split_path[split_path.length - 1]
                    let split_name = image_name.split(".")
                    let extension = split_name.pop()
                    let joined_name = split_name.join(".")
                    split_path[split_path.length - 1] = joined_name + "-tint." + extension
                    let new_photo_path = split_path.join("\\")
                    let filtered_photo = await sharp(server_image_path)
                        .tint({ r: 255, g: 0, b: 0 })
                        .toFile(new_photo_path);
                    resolve(new_photo_path)
                })
        }
    }
}

export default filter_functions
