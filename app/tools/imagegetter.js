import * as fs from 'fs'
const image_getting = {
    get_file: async function (file_path) {
        let file = fs.readFileSync(file_path)
        console.log(file);
        return file

    }
}

export default image_getting