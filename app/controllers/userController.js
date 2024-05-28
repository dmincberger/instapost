import 'dotenv/config'
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
const { hash, compare } = bcryptjs;
const { sign, verify } = jsonwebtoken;
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
    }
}

export default user_functions