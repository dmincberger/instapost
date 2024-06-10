import funkcje_JSON from "../controllers/jsonController.js"
import token_functions from "../controllers/JSONWT_controller.js"
import user_functions from "../controllers/userController.js"
import image_getting from "../tools/imagegetter.js"
import { current_users_JSON } from "../controllers/userController.js"
import { get_body_data, upload_profile_picture } from "../tools/getRequestData.js"
import { expired_tokens } from "../controllers/JSONWT_controller.js"
const profile_router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match("\/api\/profile\/images")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let email = decoded_token["email"]
                    let user_photos = await funkcje_JSON.Zdjecia_uzytkownika(email)
                    res.setHeader("Content-type", "json/application")
                    res.write(JSON.stringify(user_photos, 5, null))
                    res.end()
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
                break
            } else if (req.url.match("\/api\/profile\/picture")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    console.log(typeof decoded_token);
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let email = decoded_token["email"]
                    let filtered_users = current_users_JSON.filter((user) => user["email"] == email)
                    if (filtered_users.length == 0) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("your user does not exist. Please register an account")
                        res.end()
                        return 0
                    }
                    let user_info = await user_functions.get_user_info(["picture"], email)
                    if (user_info["picture"] == null) {
                        let url = "default.jpg"
                        let profile_picture = await image_getting.get_file(url)
                        res.setHeader("Content-type", "image/jpeg")
                        res.write(profile_picture)
                        res.end()
                        return 0
                    }
                    if (user_info["picture"] == "custom") {
                        let url = "uploads\\" + email + "\\profile.jpg"
                        let profile_picture = await image_getting.get_file(url)
                        res.setHeader("Content-type", "image/jpeg")
                        res.write(profile_picture)
                        res.end()
                        return 0
                    }
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
                break
            }

            else if (req.url.match("\/api\/profile\/logout")) {
                console.log("LOGOUCIK");
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("expired")
                        res.end()
                        return 0
                    }
                    token_functions.expire_a_token(token)
                    res.setHeader("Content-type", "text/plain")
                    res.write("success")
                    res.end()
                    return 0
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                }
            }
            else if (req.url.match("\/api\/profile")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let sent_email = decoded_token["email"]

                    let user_info = await user_functions.get_user_info(["email", "name", "lastName"], sent_email)
                    res.setHeader("Content-type", "application/json")
                    res.write(JSON.stringify(user_info))
                    res.end()
                    return 0

                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
                break
            }

        case "POST":
            if (req.url.match("\/api\/profile\/user\/images")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let dane = await get_body_data(req)
                    let parsed_dane = await JSON.parse(dane)
                    let email = parsed_dane["email"]
                    let filtered_users = current_users_JSON.filter((user) => user["email"] == email)
                    if (filtered_users.length == 0) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("none")
                        res.end()
                        return 0
                    }
                    let user_photos = await funkcje_JSON.Zdjecia_uzytkownika(email)
                    res.setHeader("Content-type", "json/application")
                    res.write(JSON.stringify(user_photos, 5, null))
                    res.end()
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
                break
            }
            else if (req.url.match("\/api\/profile\/picture\/user")) {
                console.log("USER BITCH");
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    console.log(typeof decoded_token);
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let dane = await get_body_data(req)
                    let parsed_dane = await JSON.parse(dane)
                    let email = parsed_dane["email"]
                    let filtered_users = current_users_JSON.filter((user) => user["email"] == email)
                    if (filtered_users.length == 0) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("your user does not exist. Please register an account")
                        res.end()
                        return 0
                    }
                    let user_info = await user_functions.get_user_info(["picture"], email)
                    if (user_info["picture"] == null) {
                        let url = "default.jpg"
                        let profile_picture = await image_getting.get_file(url)
                        res.setHeader("Content-type", "image/jpeg")
                        res.write(profile_picture)
                        res.end()
                        return 0
                    }
                    if (user_info["picture"] == "custom") {
                        let url = "uploads\\" + email + "\\profile.jpg"
                        let profile_picture = await image_getting.get_file(url)
                        res.setHeader("Content-type", "image/jpeg")
                        res.write(profile_picture)
                        res.end()
                        return 0
                    }
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
                break
            }
            else if (req.url.match("\/api\/profile")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    let email = decoded_token["email"]
                    let user_info = await user_functions.get_user_info(["name"], email)
                    let name = user_info["name"]
                    console.log("NAME: " + name);
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let dane = await upload_profile_picture(req, email)
                    await user_functions.update_user_profile([{ "picture": "custom" }], email)
                    res.setHeader("Content-type", "text/plain")
                    res.write(`picture updated`)
                    res.end()
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
                break
            }

        case "PATCH":
            if (req.url.match("\/api\/profile")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    if (decoded_token == undefined || expired_tokens.includes(token)) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let sent_email = decoded_token["email"]
                    let data = await get_body_data(req)
                    console.log("DATA: " + data);
                    let parsed_data = JSON.parse(data)
                    console.log(parsed_data);
                    await user_functions.update_user_profile([parsed_data], sent_email)
                    res.setHeader("Content-type", "text/plain")
                    res.write(`data updated for the user`)
                    res.end()
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
                break
            }
    }
}

export default profile_router