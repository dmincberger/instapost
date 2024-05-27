import image_getting from "./imagegetter.js"
import { zdjecia_dane } from "./jsonController.js"
const image_get_Router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match("\/api\/getimage\/([0-9]+)")) {
                console.log("cfffaffokeroghuihuiegwh");
                let req_split = req.url.split("/")
                let photo_id = req_split[3]
                let found_photos = zdjecia_dane.filter((photo) => photo["id"] == photo_id)
                let found_url = found_photos[0]["url"]
                if (found_url == undefined) {
                    res.write(JSON.stringify("no such photo exists", 5, null))
                    res.end()
                } else {
                    let file = await image_getting.get_file(found_url)
                    res.setHeader('Content-Type', 'image/jpeg')
                    res.write(file)
                    res.end()
                }
            }
    }
}

export default image_get_Router