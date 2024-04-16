let zdjecia_dane = {}

export default function dodaj_zdjecie(fields, files) {
    let zdjecie = {
        "id": 'holder', // gettime
        "album": fields["album"],
        "originalName": files['name'],
        "url": "f"
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