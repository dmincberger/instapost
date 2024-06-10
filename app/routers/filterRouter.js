import filter_functions from "../controllers/filterController.js"
import funkcje_JSON, { zdjecia_dane } from "../controllers/jsonController.js"
import { get_body_data } from "../tools/getRequestData.js"
import image_getting from "../tools/imagegetter.js";

const filterRouter = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match("\/api\/filters\/metadata\/([0-9]+)")) {
                let req_split = req.url.split("/")
                let photo_id = req_split[4]
                let found_photos = zdjecia_dane.filter((photo) => photo["id"] == photo_id)
                if (found_photos.length == 0) {
                    res.write(JSON.stringify("no such photo exists", 5, null))
                    res.end()
                } else {
                    let found_url = found_photos[0]["url"]
                    let response = await filter_functions.get_metadata(found_url)
                    res.write(JSON.stringify(response, 5, null))
                    res.end()
                }
                break
            }
        case "PATCH":
            if (req.url.match("\/api\/filters\/([0-9]+)")) {
                let dane = await get_body_data(req)
                console.log(dane);
                let dane_parsed = JSON.parse(dane)
                let req_split = req.url.split("/")
                let chosen_id = req_split[3]
                console.log(chosen_id);
                let found_photos = zdjecia_dane.filter((photo) => photo["id"] == chosen_id)
                let indexik = found_photos[0]["history"].length - 1
                let found_url = found_photos[0]["url"]
                console.log(indexik + ": INDEX");
                if (indexik != 0) {
                    found_url = found_photos[0]["history"][indexik]["url"]
                    console.log("FOUND URL: " + found_url);
                }
                if (found_url == undefined) {
                    res.write(JSON.stringify("no such photo exists", 5, null))
                    res.end()
                } else {
                    let chosen_filter = dane_parsed["filter"]
                    let new_path = await filter_functions.filter_photo(found_url, chosen_filter)
                    let history_update = {
                        "status": chosen_filter,
                        "timestamp": Date.now(),
                        "url": new_path
                    }
                    let found_photo = found_photos[0]
                    let photo_index = zdjecia_dane.indexOf(found_photo)
                    found_photo["history"].push(history_update)
                    funkcje_JSON.Aktualizacja_zdjecia(found_photo, photo_index)
                    let photo = await image_getting.get_file(new_path)
                    res.setHeader('Content-Type', 'image/jpeg')
                    res.write(photo)
                    res.end()
                }
            }
        case "POST":
            if (req.url.match("\/api\/filters")) {
                let dane = await get_body_data(req)
                let parsed_dane = await JSON.parse(dane)
                console.log(dane);
                let file_data = parsed_dane["file"]
                file_data = file_data.replace(/^data:image\/\w+;base64,/, '')
                let buffer_data = Buffer.from(file_data, 'base64')
                let filter = parsed_dane["filter"]
                let filtered_photo = await filter_functions.filter_base64_photo(buffer_data, filter)
                res.setHeader('Content-Type', 'image/jpeg')
                res.write(filtered_photo)
                res.end()
            }
    }
}

export default filterRouter