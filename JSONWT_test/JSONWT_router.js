
import bcryptjs from 'bcryptjs';
import path from "path";
import tracer from "tracer"
import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config'

let SECRET_KEY = process.env.SECRET_KEY

// ################################################

const { hash, compare } = bcryptjs;
const { sign, verify } = jsonwebtoken;

// ################################################


const encryptPass = async (password) => { // przyjmuje haslo do zahasowania
    let encryptedPassword = await hash(password, 10);
    console.log({ encryptedPassword: encryptedPassword });
    return encryptedPassword // zwraca hashowane haslo
}

// ################################################


const decryptPass = async (userpass, encrypted) => {  // przyjmuje haslo niezaszyfrowane, oraz zaszyfrowane juz
    let decrypted = await compare(userpass, encrypted)
    console.log(decrypted);
    return decrypted // zwraca true jesli takie same, false jesli zahasowane wartosci nie sa takie same
}

// ################################################

const createToken = async () => {

    let token = await sign(
        {
            email: "aaa@test.com",
            anyData: "123"
        },
        SECRET_KEY, // key powinien być zapisany w .env
        {
            expiresIn: "30s" // "1m", "1d", "24h"
        }
    );
    console.log({ token: token });
    return token
}

// ################################################
const verifyToken = (token) => {
    try {
        let decoded = verify(token, SECRET_KEY)
        console.log({ decoded: decoded });
        return decoded // zwraca kompletnie zdekodowany token, email itp. widoczne jako JSON
    }
    catch (ex) {
        console.log({ message: ex.message });
    }
}


const processToken = async () => {
    let token = await createToken()
    console.log("PRZEKAZYWANY TOKEN: " + token);
    verifyToken(token)
}

// ################################################


const router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url == "/JSONBC_encrypt") {
                const pass = "moje tajne hasło"

                let haslo = await encryptPass(pass)
                res.writeHead(200, { 'Content-type': 'application/json' })
                res.write(JSON.stringify(haslo))
                res.end()
            }

            // ################################################


            else if (req.url == "/JSONBC_decrypt") {
                const pass = "moje tajne hasło"

                let haslo = await encryptPass(pass)

                let rozszyfrowane = await decryptPass(pass, haslo)
                res.writeHead(200, { 'Content-type': 'application/json' })
                res.write(JSON.stringify(rozszyfrowane))
                res.end()



            }

            // ################################################


            else if (req.url == "/JSONWT_create") {
                let token = await createToken()
                res.writeHead(200, { 'Content-type': 'application/json' })
                res.write(JSON.stringify(token))
            }

            // ################################################

            else if (req.url == "/JSONWT_verify") {
                let verify = processToken()
                res.writeHead(200, { 'Content-type': 'application/json' })
                res.write(JSON.stringify(verify))
            }

            // ################################################

            else if (req.url == "")

            break;

        case "POST":
    }
}

export default router