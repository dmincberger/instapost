import { get_body_data } from "../tools/getRequestData.js"
import user_functions, { current_users_JSON } from "../controllers/userController.js"
import token_functions from "../controllers/JSONWT_controller.js"
const user_router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match(/\/api\/user\/confirm\/([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/)) {
                let split_req = req.url.split("/")
                let token_sent = split_req[4]
                let decoded_token = await token_functions.verify_token(token_sent)
                console.log(decoded_token);
                if (decoded_token != undefined) {
                    let email = decoded_token["email"]
                    let index = 0
                    for (const element of current_users_JSON) {
                        if (current_users_JSON[index]["email"] == email) {
                            current_users_JSON[index]["confirmed"] = true
                            break
                        }
                        index++
                    }
                    console.log(current_users_JSON);
                    res.setHeader("Content-type", "application/json")
                    res.write(JSON.stringify(decoded_token, 5, null))
                    res.end()
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write("twoj link do potwierdzenia konta wygasl, prosze zalozyc nowe konto")
                    res.end()
                }
                break
            }
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
                    "lastname": parsed_data["lastName"],
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
            else if (req.url.match("\/api\/user\/login")) {
                let data = await get_body_data(req)
                let parsed_data = JSON.parse(data)
                let email = parsed_data["email"]
                let index = 0
                let password = ""
                for (const element of current_users_JSON) {
                    if (current_users_JSON[index]["email"] == email) {
                        current_users_JSON[index]["confirmed"] = true
                        break
                    }
                    index++
                }
                let sent_password = parsed_data["password"]
                let password_to_check = current_users_JSON[index]["password"]
                let is_password_correct = await user_functions.decrypt_pass(sent_password, password_to_check)
                if (is_password_correct == true) {
                    let auth_token = await token_functions.create_token(email)
                    res.setHeader('Authorization', 'Bearer ' + auth_token);
                    res.setHeader("Content-type", "text/plain")
                    res.write("gratulacje udalo sie zalogowac")
                    res.end()
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write("no niezbyt udalo sie :/")
                    res.end()
                }
            }

    }
}

export default user_router