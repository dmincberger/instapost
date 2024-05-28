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
                let found_url = found_photos[0]["url"]
                if (found_url == undefined) {
                    res.write(JSON.stringify("no such photo exists", 5, null))
                    res.end()
                } else {
                    let response = await filter_functions.get_metadata(found_url)
                    res.write(JSON.stringify(response, 5, null))
                    res.end()
                }
                break
            }
        case "PATCH":
            if (req.url.match("\/api\/filters")) {
                let dane = await get_body_data(req)
                let dane_parsed = JSON.parse(dane)
                let chosen_id = dane_parsed["id"]
                let found_photos = zdjecia_dane.filter((photo) => photo["id"] == chosen_id)
                let found_url = found_photos[0]["url"]
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
    }
}

export default filterRouter