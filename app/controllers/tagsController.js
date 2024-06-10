let wszystkie_tagi = [{
    "name": "#love",
    "popularnosc": 615,
    "id": 1
},
{
    "name": "#instagood",
    "popularnosc": 922,
    "id": 2
},
{
    "name": "#fashion",
    "popularnosc": 998,
    "id": 3
},
{
    "name": "#instagram",
    "popularnosc": 502,
    "id": 4
},
{
    "name": "#photooftheday",
    "popularnosc": 542,
    "id": 5
},
{
    "name": "#art",
    "popularnosc": 521,
    "id": 6
},
{
    "name": "#photography",
    "popularnosc": 369,
    "id": 7
},
{
    "name": "#beautiful",
    "popularnosc": 643,
    "id": 8
},
{
    "name": "#nature",
    "popularnosc": 541,
    "id": 9
},
{
    "name": "#picoftheday",
    "popularnosc": 905,
    "id": 10
},
{
    "name": "#travel",
    "popularnosc": 367,
    "id": 11
},
{
    "name": "#happy",
    "popularnosc": 357,
    "id": 12
},
{
    "name": "#cute",
    "popularnosc": 719,
    "id": 13
},
{
    "name": "#instadaily",
    "popularnosc": 316,
    "id": 14
},
{
    "name": "#style",
    "popularnosc": 938,
    "id": 15
},
{
    "name": "#tbt",
    "popularnosc": 138,
    "id": 16
},
{
    "name": "#repost",
    "popularnosc": 606,
    "id": 17
},
{
    "name": "#followme",
    "popularnosc": 980,
    "id": 18
},
{
    "name": "#summer",
    "popularnosc": 406,
    "id": 19
},
{
    "name": "#reels",
    "popularnosc": 751,
    "id": 20
},
{
    "name": "#like4like",
    "popularnosc": 214,
    "id": 21
},
{
    "name": "#beauty",
    "popularnosc": 271,
    "id": 22
},
{
    "name": "#fitness",
    "popularnosc": 522,
    "id": 23
},
{
    "name": "#food",
    "popularnosc": 530,
    "id": 24
}]

export const funkcje_tagow = {

    get_tagi: function () {

        return wszystkie_tagi
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
        if (wszystkie_tagi.filter((tag) => { tag.name == dane["name"] }).length != 0) {
            return "tag juz istnieje w bazie danych"
        } else {
            wszystkie_tagi.push({ "name": dane["name"], "popularnosc": dane["popularnosc"], "id": wszystkie_tagi.length - 1 })
            return "tag dodany"
        }
    }
}

export { wszystkie_tagi }