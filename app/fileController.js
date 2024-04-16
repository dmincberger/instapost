import * as fs from 'fs'
import path from "path"
let Funkcje_Plikow = {
    Stworz_album: async (sciezka, nazwa) => {
        if (fs.existsSync(path.join(sciezka, nazwa))) {
            return 0
        } else {
            fs.mkdirSync(path.join(sciezka, nazwa))
            return 0
        }
    },

    Przenies_plik: async (root_sciezka, stary_upload, nazwa_albumu) => {
        console.log("FEJWFJE");
        let splitowany_stary_upload = stary_upload.split("\\")
        splitowany_stary_upload.splice(1, 0, nazwa_albumu)
        let nowy_upload = splitowany_stary_upload.join("\\")
        let nowa_sciezka = path.join(root_sciezka, nowy_upload)
        let stara_sciezka = path.join(root_sciezka, stary_upload)
        console.log(`NOWA SCIEZKA: ${nowa_sciezka}`);
        console.log(`STARA SCIEZKA: ${stara_sciezka}`);
        fs.renameSync(stara_sciezka, nowa_sciezka)
        return 0
    }
}
export default Funkcje_Plikow