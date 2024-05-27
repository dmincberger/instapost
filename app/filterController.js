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
    }
}

export default filter_functions
