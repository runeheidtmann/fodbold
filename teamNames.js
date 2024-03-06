// teamNames are stored here for readability, and because the may need to change at beginning of football season.
function teamNames(teamName) {
    const teamNamesDictionary = {
        "holstebro": "Holstebro",
        "ishoj": "Ishøj",
        "Holbaek": "Holbæk B&I",
        "avarta": "Avarta",
        "VSKAarhus": "VSK Århus",
        "sfboure": "SfB-Oure",
        "lyseng": "Lyseng",
        "hik": "HIK",
        "vejgaardb": "Vejgaard B",
        "frem": "Frem",
        "brabrand": "Brabrand",
        "nykobing": "Nykøbing",
        "thisted": "Thisted",
        "ab": "AB",
        "youngboys": "Young Boys",
        "naesby": "Næsby",
        "middelfart": "Middelfart",
        "vanlose": "Vanløse",
        "fa2000": "FA 2000",
        "fremadamager": "Fremad Amager",
        "Roskilde": "Roskilde",
        "Esbjerg": "Esbjerg",
        "aarhusfremad": "Aarhus Fremad",
        "skive": "Skive",
        // Add the rest of the team names and their versions here
    };

    return teamNamesDictionary[teamName] || teamName;
}

module.exports = teamNames;

