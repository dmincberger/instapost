let zdjecia_dane = []

let funkcje_JSON = {
    dodaj_zdjecie: function (email, files, nowy_upload) {
        console.log("ZROBIONE");
        let zdjecie = {
            "id": Date.now(),
            "album": email,
            "originalName": files["file"]['name'],
            "url": nowy_upload,
            "lastChange": "original",
            "history": [
                {
                    "status": "original",
                    "timestamp": Date.now()
                }
            ],
            "tags": [],
            // "image_data": image_data
        }
        zdjecia_dane.push(zdjecie)
        return 0
    },
    Patch_zdjecie(index) {
        let ilosc_zmian = zdjecia_dane[index]["history"].length;
        let zmiana = {
            "status": "zmieniono " + ilosc_zmian + " raz",
            "timestamp": Date.now()
        }
        zdjecia_dane[index]["history"].push(zmiana)
    },

    Aktualizacja_zdjecia(zdjecie, index) {
        zdjecia_dane[index] = zdjecie
    },


    async Zdjecia_uzytkownika(email) {
        let user_photos = []
        for (const photo of zdjecia_dane) {
            if (photo["album"] == email) {
                user_photos.push(photo)
            }
        }
        return user_photos
    }

}


// {
//     "id": "id",
//     "album": "album",
//     "originalName": "originalName",
//     "url": "url",
//     "lastChange": "original",
//     "history": [
//          {
//               "status": "original",
//               "lastModifiedDate": "lastModifiedDate"
//          }
//     ]
// }

export { zdjecia_dane }
export default funkcje_JSON