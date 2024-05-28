import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
const { hash, compare } = bcryptjs;
const { sign, verify } = jsonwebtoken;
let SECRET_KEY = process.env.SECRET_KEY

const token_functions = {
    create_token: async (email) => {

        let token = await sign(
            { "email": email },
            SECRET_KEY, // key powinien być zapisany w .env
            {
                expiresIn: "30s" // "1m", "1d", "24h"
            }
        );
        console.log({ token: token });
        return token
    },
    verify_token: (token) => {
        try {
            let decoded = verify(token, SECRET_KEY)
            console.log({ decoded: decoded });
            return decoded // zwraca kompletnie zdekodowany token, email itp. widoczne jako JSON
        }
        catch (ex) {
            console.log({ message: ex.message });
        }
    },
    process_token: async () => {
        let token = await createToken()
        verifyToken(token)
    }
}

export default token_functions