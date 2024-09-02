const grupe = require('./groups.json');

function SimulacijaMeca(tim1, tim2){
    let winner, loser, loserPoints, winnerPoints;
    rank1 = tim1.FIBARanking;
    rank2 = tim2.FIBARanking;
    const tim1Dobija = rank2 / (rank2+rank1);

    const random = Math.random();
    let poeni1 = Math.floor(Math.random() * 50) + 65;
    let poeni2 = Math.floor(Math.random() * 50) + 65;

    if(poeni1 > poeni2){
        winnerPoints = poeni1;
        loserPoints = poeni2;
    } else if(poeni2 > poeni1){
        winnerPoints = poeni2;
        loserPoints = poeni1;
    } else {
        const extraPobednik = Math.random() < 0.5 ? poeni1 : poeni2;
        if(extraPobednik === poeni1){
            poeni1+=10;
            winnerPoints = poeni1;
            loserPoints = poeni2;
        } else{
            poeni2+=10;
            winnerPoints=poeni2;
            loserPoints = poeni1;
        }
    }

    if(random<tim1Dobija){
        winner = tim1;
        loser = tim2;
        return {winner, loser, winnerPoints, loserPoints};
    } else{
        winner = tim2;
        loser = tim1;
        return {winner, loser, winnerPoints, loserPoints};
    }

}

function SimulacijaGrupe(grupa){
    const rezultatiGrupe = grupa.map(tim =>({
        ...tim,
        W: 0,
        L: 0,
        poeni: 0,
        postignuto: 0,
        primljeno: 0,
        mecevi: []
    }));
    const meceviPoRundi = [
        [[0, 1], [2, 3]],
        [[0, 2], [1, 3]],
        [[0, 3], [1, 2]]
    ]

    meceviPoRundi.forEach((runda) => {
        runda.forEach(([i, j]) => {
            const tim1 = rezultatiGrupe[i];
            const tim2 = rezultatiGrupe[j];
            const { winner, loser, winnerPoints, loserPoints} = SimulacijaMeca(tim1, tim2);

            winner.W++;
            loser.L++;
            winner.poeni+=2;
            loser.poeni+=1;
            winner.postignuto+= winnerPoints;
            loser.postignuto+= loserPoints;
            winner.primljeno+=loserPoints;
            loser.primljeno+=winnerPoints;

            winner.mecevi.push({protivnik: loser.Team, rezultat: `${winnerPoints}:${loserPoints}`});
            loser.mecevi.push({protivnik: winner.Team, rezultat: `${loserPoints}:${winnerPoints}`});
        });
    });
    rezultatiGrupe.sort((a, b) => b.poeni - a.poeni || MedjusobniSkor(a, b) || KosRazlika(a, b));

    return rezultatiGrupe;
}

function MeceviOdredjeneRunde(rezultatiGrupe, runda){
    const meceviPoRundi = [
        [[0, 1], [2, 3]],
        [[0, 2], [1, 3]],
        [[0, 3], [1, 2]]
    ];

    const meceviRunde = meceviPoRundi[runda - 1].map(([i, j]) => {
        const tim1 = rezultatiGrupe[i];
        const tim2 = rezultatiGrupe[j];
        const utakmica = tim1.mecevi.find(utakmica => utakmica.protivnik === tim2.Team);
        if(utakmica){
            const [score1, score2] = utakmica.rezultat.split(":").map(Number);
            return {tim1: tim1.Team, tim2: tim2.Team, score1, score2};
        } else{
            return {tim1: tim1.Team, tim2: tim2.Team, score1: 0, score2: 0};
        }
    });
    return meceviRunde;

}

function MedjusobniSkor(tim1, tim2){
    const utakmica = tim1.mecevi.find(mec => mec.protvnik === tim2.Team);
    if(utakmica){
        const rezultat = utakmica.rezultat.split(":").map(Number);
        return rezultat[1] - rezultat[0];
    }
}

function KosRazlika(tim1, tim2){
    const tim1KosRazlika = tim1.postignuto - tim1.primljeno;
    const tim2KosRazlika = tim2.postignuto - tim2.primljeno;

    return tim2KosRazlika - tim1KosRazlika;
}

function SesiriCetvrtfinala(prvoplasiraniTimovi, drugoplasiraniTimovi, treceplasiraniTimovi){
    prvoplasiraniTimovi.sort((a, b) => b.poeni - a.poeni || KosRazlika(a, b) || b.postignuto - a.postignuto);
    drugoplasiraniTimovi.sort((a, b) => b.poeni - a.poeni || KosRazlika(a, b) || b.postignuto - a.postignuto);
    treceplasiraniTimovi.sort((a, b) => b.poeni - a.poeni || KosRazlika(a, b) || b.postignuto - a.postignuto);

    const plasiraniTimovi = [...prvoplasiraniTimovi, ...drugoplasiraniTimovi, ...treceplasiraniTimovi];

    const sesirD = [plasiraniTimovi[0], plasiraniTimovi[1]];
    const sesirE = [plasiraniTimovi[2], plasiraniTimovi[3]];
    const sesirF = [plasiraniTimovi[4], plasiraniTimovi[5]];
    const sesirG = [plasiraniTimovi[6], plasiraniTimovi[7]];

    return {sesirD, sesirE, sesirF, sesirG};
}

function IzaberiTimIzSesira(sesir){
    const index = Math.floor(Math.random() * sesir.length);
    const tim = sesir[index];
    sesir.splice(index, 1);
    return tim;
}

function MedjusobniDuel(tim1, tim2){
    if(!tim1 || !tim2) return false;
    return tim1.mecevi.some(mec => mec.protivnik === tim2.Team);
}

function NapraviParove(sesir1, sesir2){
    parovi = [];
    while(sesir1.length > 0 && sesir2.length > 0){
        let tim1 = IzaberiTimIzSesira(sesir1);
        let tim2 = IzaberiTimIzSesira(sesir2);

        while(tim1 && tim2 && MedjusobniDuel(tim1, tim2)){
            sesir2.push(tim2);
            tim2 = IzaberiTimIzSesira(sesir2);
            if(sesir2.length === 0) break;
        }

        if(tim1 && tim2){
            parovi.push({tim1, tim2});
        }
    }
    return parovi;
}

function CetvrtfinaleParovi(sesirD, sesirE, sesirF, sesirG){
    const paroviCetvrtFinala = [
        ...NapraviParove(sesirD, sesirG),
        ...NapraviParove(sesirE, sesirF)
    ]

    return paroviCetvrtFinala;
}

module.exports = {
    SimulacijaMeca,
    SimulacijaGrupe,
    MeceviOdredjeneRunde,
    SesiriCetvrtfinala,
    CetvrtfinaleParovi
};