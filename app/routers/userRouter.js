import { get_body_data } from "../tools/getRequestData.js"
import user_functions from "../controllers/userController.js"
import token_functions from "../controllers/JSONWT_controller.js"
const user_router = async (req, res) => {
    switch (req.method) {
        case "GET":
            break
        case "POST":
            if (req.url.match("\/api\/user\/register")) {
                let data = await get_body_data(req)
                let parsed_data = JSON.parse(data)
                let plain_password = parsed_data["password"]
                let hashed_password = await user_functions.encrypt_pass(plain_password)
                let new_user = {
                    "id": Date.now(),
                    "name": parsed_data["name"],
                    "lastname": parsed_data["lastname"],
                    "email": parsed_data["email"],
                    "confirmed": false,
                    "password": hashed_password
                }
                let new_token = await token_functions.create_token(new_user["email"])
                user_functions.add_register_user(new_user)
                res.setHeader("Content-type", "text/plain")
                res.write(`skopiuj poniższy link do przeglądarki w celu potwierdzenia konta:\nhttp://localhost:3000/api/user/confirm/${new_token}\nUwaga: link jest ważny przez godzinę`)
                res.end()
                break
            }
            else if (req.url.match("\/api\/user\/confirm\/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)")) {
                console.log("fwefkowewjokfw");
                res.setHeader("Content-type", "text/plain")
                res.write("MAMY TOKEN")
                res.end()
                break
            }
    }
}

export default user_router