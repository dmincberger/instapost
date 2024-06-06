import token_functions from "../controllers/JSONWT_controller.js"
import user_functions from "../controllers/userController.js"
import { get_body_data, upload_profile_picture } from "../tools/getRequestData.js"
const profile_router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match("\/api\/profile")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    if (decoded_token == undefined) {
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
            } else if (req.url.match("\/api\/logout")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    if (decoded_token == undefined) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    token_functions.expire_a_token(token)
                    res.setHeader("Content-type", "text/plain")
                    res.write("you will be redirected to the login page shortly")
                    res.end()
                    return 0
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                }
            }

        case "POST":
            if (req.url.match("\/api\/profile")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    let email = decoded_token["email"]
                    let user_info = await user_functions.get_user_info(["name"], email)
                    let name = user_info["name"]
                    console.log("NAME: " + name);
                    if (decoded_token == undefined) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let dane = await upload_profile_picture(req, name)
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
                    if (decoded_token == undefined) {
                        res.setHeader("Content-type", "text/plain")
                        res.write("user session expired, please log in again\n you will be redirected to the login page shortly")
                        res.end()
                        return 0
                    }
                    let sent_email = decoded_token["email"]
                    let data = await get_body_data(req)
                    let parsed_data = JSON.parse(data)
                    await user_functions.update_user_profile(parsed_data, sent_email)
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