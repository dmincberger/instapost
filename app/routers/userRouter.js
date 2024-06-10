import { get_body_data } from "../tools/getRequestData.js"
import user_functions, { current_users_JSON } from "../controllers/userController.js"
import token_functions from "../controllers/JSONWT_controller.js"
const user_router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match(/\/api\/user\/confirm\?token=([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/)) {
                let split_req = req.url.split("=")
                let token_sent = split_req[1]
                console.log("TOKENIK: " + token_sent);
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
                    res.setHeader("Content-type", "text/plain")
                    res.write("Konto założone poprawnie! Możesz wyłączyć tą kartę.")
                    res.end()
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write("twoj link do potwierdzenia konta wygasl, prosze zalozyc nowe konto")
                    res.end()
                }
                break
            }
            else if (req.url.match("\/api\/users")) {
                let all_users = await user_functions.get_all_users()
                res.setHeader("Content-type", "application/json")
                res.write(JSON.stringify(all_users))
                res.end()
            }
            break
        case "POST":
            if (req.url.match("\/api\/user\/register")) {
                console.log("WTF");
                let data = await get_body_data(req)
                let parsed_data = JSON.parse(data)
                let plain_password = parsed_data["password"]
                if (plain_password.length <= 3) {
                    res.setHeader("Content-type", "text/plain")
                    res.write("twoje haslo nie jest wystarczajaco dlugie")
                    res.end()
                    return 0
                }
                for (const user of current_users_JSON) {
                    if (user["email"] == parsed_data["email"]) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("na podany email jest juz zalozone konto")
                        res.end()
                        return 0
                    }
                }
                let hashed_password = await user_functions.encrypt_pass(plain_password)
                let new_user = {
                    "id": Date.now(),
                    "name": parsed_data["name"],
                    "lastname": parsed_data["lastName"],
                    "email": parsed_data["email"],
                    "confirmed": false,
                    "password": hashed_password,
                    "picture": null
                }
                let new_token = await token_functions.create_token(parsed_data["email"], "1h")
                user_functions.add_register_user(new_user)
                res.setHeader("Content-type", "text/plain")
                res.write(`http://localhost:5173/confirm?token=${new_token}`)
                await user_functions.send_register_link(`http://localhost:5173/confirm?token=${new_token}`, parsed_data["email"])
                res.end()
                break
            }
            else if (req.url.match("\/api\/user\/login")) {


                let data = await get_body_data(req)
                let parsed_data = JSON.parse(data)
                let email = parsed_data["email"]
                let index = 0
                let password = ""
                if (current_users_JSON.length == 0) {
                    res.setHeader("Content-type", "text/plain")
                    res.write("UZYTKOWNIK NIE ISTNIEJE")
                    res.end()
                    return 0
                }
                for (const element of current_users_JSON) {
                    if (current_users_JSON[index]["email"] == email) {
                        current_users_JSON[index]["confirmed"] = true
                        break
                    }
                    index++
                }
                if (current_users_JSON[index] == undefined) {
                    res.setHeader("Content-type", "text/plain")
                    res.write("UZYTKOWNIK NIE ISTNIEJE")
                    res.end()
                    return 0
                }
                console.log("OBECNY UZYTKOWNIK: " + current_users_JSON[index]);
                if (current_users_JSON[index]["confirmed"] == false) {
                    res.setHeader("Content-type", "text/plain")
                    res.write("KONTO NIE POTWIERDZONE, PROSZE POTWIERDZIC KONTO")
                    res.end()
                    return 0
                }
                let sent_password = parsed_data["password"]
                let password_to_check = current_users_JSON[index]["password"]
                let is_password_correct = await user_functions.decrypt_pass(sent_password, password_to_check)
                if (is_password_correct == true) {
                    let auth_token = await token_functions.create_token(email, "24h")
                    res.setHeader("Content-type", "application/json")
                    res.write(JSON.stringify({ JWT: auth_token }, 5, null))
                    res.end()
                    return 0
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write("UZYTKOWNIK NIE ISTNIEJE BLEDNY EMAIL/HASLO")
                    res.end()
                    return 0
                }

            }

    }
}

export default user_router