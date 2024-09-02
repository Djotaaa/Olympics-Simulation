const { SimulacijaMeca, SimulacijaGrupe, MeceviOdredjeneRunde, SesiriCetvrtfinala, CetvrtfinaleParovi } = require("./functions");
const grupe = require("./groups.json");

prvoplasiraniTimovi = [];
drugoplasiraniTimovi = [];
treceplasiraniTimovi = [];


Object.keys(grupe).forEach(grupa =>{
    const imeGrupe = grupe[grupa];
    const rezultatGrupe = SimulacijaGrupe(imeGrupe);

    for(let runda = 1; runda<=3;runda++){
        console.log(`\n${runda} kolo:\nGrupa ${grupa}\n`);
        const meceviRunde = MeceviOdredjeneRunde(rezultatGrupe, runda);
        meceviRunde.forEach(mec =>{
            console.log(`   ${mec.tim1} - ${mec.tim2}   (${mec.score1}:${mec.score2})`);
        });
    }
    console.log("\n");
    console.log(`Konacan plasman u grupi ${grupa} - Ime/pobede/porazi/poeni/postignuti kosevi/primljeni kosevi/Kos razlika`);
    rezultatGrupe.forEach((tim, index)=>{
        const kosRazlika = tim.postignuto - tim.primljeno;
        console.log(`${index + 1}. ${tim.Team.padEnd(10)} ${tim.W} / ${tim.L} / ${tim.poeni} / ${tim.postignuto} / ${tim.primljeno} / ${kosRazlika > 0 ? "+" : ""}${kosRazlika}`);
        if(index===0){
            prvoplasiraniTimovi.push(tim);
        } else if(index===1){
            drugoplasiraniTimovi.push(tim);
        } else if(index===2){
            treceplasiraniTimovi.push(tim);
        }
    });
});
const { sesirD, sesirE, sesirF, sesirG } = SesiriCetvrtfinala(prvoplasiraniTimovi, drugoplasiraniTimovi, treceplasiraniTimovi);

console.log("\n Sesiri:\n");
console.log("   Sesir D:");
console.log(`       ${sesirD[0].Team}\n       ${sesirD[1].Team}`);
console.log("   Sesir E:");
console.log(`       ${sesirE[0].Team}\n       ${sesirE[1].Team}`);
console.log("   Sesir F:");
console.log(`       ${sesirF[0].Team}\n       ${sesirF[1].Team}`);
console.log("   Sesir G:");
console.log(`       ${sesirG[0].Team}\n       ${sesirG[1].Team}\n`);

console.log("Eliminaciona faza:\n");
const paroviCetvrtfinala = CetvrtfinaleParovi(sesirD, sesirE, sesirF, sesirG);

const cetvrtfinalniRezultati = [];
paroviCetvrtfinala.forEach((par) => {
    console.log(`${par.tim1.Team} - ${par.tim2.Team}`);
    const rezultat = SimulacijaMeca(par.tim1, par.tim2);
    cetvrtfinalniRezultati.push(rezultat);
});

console.log("\nCetvrtfinale:\n ");
cetvrtfinalniRezultati.forEach((rezultat) => {
    console.log(`${rezultat.winner.Team} - ${rezultat.loser.Team} (${rezultat.winnerPoints}:${rezultat.loserPoints})`);

});

const paroviPolufinala = [
    [cetvrtfinalniRezultati[0].winner, cetvrtfinalniRezultati[1].winner],
    [cetvrtfinalniRezultati[2].winner, cetvrtfinalniRezultati[3].winner]
];

console.log("\nPolufinale:\n");
let bronzaniMec = [];
let finalniMec = []

paroviPolufinala.forEach((par) => {
    const rezultat = SimulacijaMeca(par[0], par[1]);
    console.log(`${rezultat.winner.Team} - ${rezultat.loser.Team} (${rezultat.winnerPoints}:${rezultat.loserPoints})`);
    bronzaniMec.push(rezultat.loser);
    finalniMec.push(rezultat.winner);
});

console.log("\nUtakmica za trece mesto: \n");
const rezultatZaBronzu = SimulacijaMeca(bronzaniMec[0], bronzaniMec[1]);
console.log(`${rezultatZaBronzu.winner.Team} - ${rezultatZaBronzu.loser.Team} (${rezultatZaBronzu.winnerPoints}:${rezultatZaBronzu.loserPoints})`);

console.log("\nFinale:\n");
const rezultatFinala = SimulacijaMeca(finalniMec[0], finalniMec[1]);
console.log(`${rezultatFinala.winner.Team} - ${rezultatFinala.loser.Team} (${rezultatFinala.winnerPoints}:${rezultatFinala.loserPoints})`);

console.log("\nMedalje:");
console.log(`1. ${rezultatFinala.winner.Team}`);
console.log(`2. ${rezultatFinala.loser.Team}`);
console.log(`3. ${rezultatZaBronzu.winner.Team}`);



