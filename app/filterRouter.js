import filter_functions from "./filterController.js"
import { zdjecia_dane } from "./jsonController.js"
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
            }
    }
}

export default filterRouter