import token_functions from "../controllers/JSONWT_controller.js"
const profile_router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match("\/api\/profile")) {
                if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                    let token = req.headers.authorization.split(" ")[1]
                    let decoded_token = token_functions.verify_token(token)
                    let sent_email = decoded_token["email"]
                    res.setHeader("Content-type", "application/json")
                    res.write(JSON.stringify(decoded_token))
                    res.end()
                    return 0
                } else {
                    res.setHeader("Content-type", "text/plain")
                    res.write(`You are not authorized to access this content!`)
                    res.end()
                    return 0
                }
            }
    }
}

export default profile_router