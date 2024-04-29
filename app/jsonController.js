let zdjecia_dane = []

let funkcje_JSON = {
    dodaj_zdjecie: function (fields, files, nowy_upload) {
        console.log(fields);
        console.log(files);
        console.log("ZROBIONE");
        let zdjecie = {
            "id": Date.now(),
            "album": fields["album"],
            "originalName": files["file"]['name'],
            "url": nowy_upload,
            "lastChange": "original",
            "history": [
                {
                    "status": "original",
                    "timestamp": Date.now()
                }
            ],
            "tags": []
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