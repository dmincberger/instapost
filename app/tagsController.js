let wszystkie_tagi = ["#love",
    "#instagood",
    "#fashion",
    "#instagram",
    "#photooftheday",
    "#art",
    "#photography",
    "#beautiful",
    "#nature",
    "#picoftheday",
    "#travel",
    "#happy",
    "#cute",
    "#instadaily",
    "#style",
    "#tbt",
    "#repost",
    "#followme",
    "#summer",
    "#reels",
    "#like4like",
    "#beauty",
    "#fitness",
    "#food"]

let tagi_popularność = [615, 922, 998, 502, 542, 521, 369, 643, 541, 905, 367, 357, 719, 316, 938, 138, 606, 980, 406, 751, 214, 271, 522, 530]

export const funkcje_tagow = {
    get_tagi: function () {
        let tagi = []
        for (let i = 0; i < wszystkie_tagi.length; i++) {
            let tag = {
                "id": i,
                "name": wszystkie_tagi[i],
                "popularnosc": tagi_popularność[i]
            }
            tagi.push(tag)
        }
        return tagi
    },
    zdobadz_dane: async function (req) {
        return new Promise((resolve) => {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                resolve(body);
            });
        });
    },
    dodaj_tag: function (dane) {
        console.log(dane["name"]);
        if (wszystkie_tagi.includes(dane["name"])) {
            return "tag juz istnieje w bazie danych"
        } else {
            wszystkie_tagi.push(dane["name"])
            tagi_popularność.push(dane["popularnosc"])
            return "tag dodany"
        }
    }
}

export { wszystkie_tagi, tagi_popularność }