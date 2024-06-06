import 'dotenv/config'
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import * as nodemailer from 'nodemailer'
const { hash, compare } = bcryptjs;
let SECRET_KEY = process.env.SECRET_KEY

export let current_users_JSON = []

const user_functions = {
    encrypt_pass: async (password) => { // przyjmuje haslo do zahasowania
        let encryptedPassword = await hash(password, 10);
        console.log({ encryptedPassword: encryptedPassword });
        return encryptedPassword // zwraca hashowane haslo
    },
    decrypt_pass: async (userpass, encrypted) => {  // przyjmuje haslo niezaszyfrowane, oraz zaszyfrowane juz
        let decrypted = await compare(userpass, encrypted)
        console.log(decrypted);
        return decrypted // zwraca true jesli takie same, false jesli zahasowane wartosci nie sa takie same
    },
    add_register_user: async (user) => {
        current_users_JSON.push(user)
    },
    update_user_profile: async (info, email) => {
        let index = 0
        for (const user of current_users_JSON) {
            if (user["email"] == email) {
                break
            }
            index++
        }
        for (const key of Object.keys(info)) {
            current_users_JSON[index][key] = info[key]
        }
        console.log(info);
    },

    get_user_info: async (fields, email) => {
        let index = 0
        for (const user of current_users_JSON) {
            if (user["email"] == email) {
                break
            }
            index++
        }
        let info_object = {}
        fields.forEach(async field => {
            info_object[field] = current_users_JSON[index][field]
        });
        return info_object
    },

    get_all_users: async () => {
        return current_users_JSON
    },

    send_register_link: async (link, email) => {
        const transporter = nodemailer.createTransport({
            host: "s1.ct8.pl",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "ziombiom@ziombiom.ct8.pl",
                pass: "Dm500220!",
            },
        });

        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: 'ziombiom@ziombiom.ct8.pl', // sender address
                to: email, // list of receivers
                subject: "Housegram register", // Subject line
                text: link, // plain text body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }
        main()
    }

}

export default user_functions