/* https://github.com/sjaks/demooni */

var verkkoaluue = document.getElementById("pakeetti-poloku");
var pakeetti = document.getElementById("pakeetti");
var poloku = [];
var luuppi;
var pystyMarginaali = 200;
var vaakaMarginaali = 100;
var volyymit = false;


// Määrittele teemaobjeektit deemooneille ja muille samankaltaisille
var teema = 0;
var teemat = [{
        nimi: "demooni",
        ikooni: '<span class="raaja vasenRaaja">&#x270b;</span>&#x1F608;<span class="raaja oikeaRaaja">&#x270b;</span>',
        pakeetti: "&#x1F4E6;",
        jahtaa: false,
        kuolevainen: true,
        etuRaajatOmaava: true
    },
    {
        nimi: "hauveli",
        ikooni: "&#x1f415;",
        pakeetti: "&#x26be;",
        jahtaa: true,
        kuolevainen: false,
        etuRaajatOmaava: false
    },
    {
        nimi: "apiina",
        ikooni: "&#x1f648;",
        pakeetti: "&#x1f34c;",
        jahtaa: false,
        kuolevainen: false,
        etuRaajatOmaava: false
    }
];


// Aluusta simulaatio lataamalla aanitteet ja luomalla ensimmäinen pakeetti
function aluustaKaikki() {
    aaniteYkkonen = new Audio("assets/sound/laugh-1.wav");
    aaniteKakkonen = new Audio("assets/sound/laugh-2.wav");

    pakeetti.style.top = window.innerHeight / 2;
    pakeetti.style.left = window.innerWidth / 2;
    lataaKuvaat();
    alootaLuuppi(1000);
}


// Luuppaile ja luo demooneita ja sen sellaista
function alootaLuuppi(i) {
    luuppi = setInterval(function() {
        siivooKuolleet();
        luoUusiDemooni(i);
        lataaKuvaat();
        liikutaPakeettia();
        aseetaNopeeus();
        if (!teemat[teema].jahtaa) ravistaDemooneita();
        if (teemat[teema].nimi === "demooni") uhmaaApiinaJumalaa();
        lataaKuvaat();
        twemoji.parse(document.body);
    }, i);
}


// Toglee demoonien sun muiden äänet
function oleeppaHiljoo() {
    if (volyymit) {
        volyymit = false;
        document.getElementById("volyymiNappula").innerHTML = "&#x1F508;";
    } else {
        volyymit = true;
        document.getElementById("volyymiNappula").innerHTML = "&#x1F50A;";
    }
    lataaKuvaat();
}


// Siivoile demooneiden ja muiden kuolleiden jäänteet listalta
function siivooKuolleet() {
     var demoonit = document.getElementsByClassName("demooni");
     var i = 0;
     Array.from(demoonit).forEach(demooni => {
        // Don't kill the ones that are already dead
        if (demooni.classList.contains("kuaallu")){
            poloku.splice(i,1);
            demooni.remove();
        } else {
            i++;
        }
    });
}


// Aseeta intervaalli, jolla demooneite tulee ja pekeetti lentää
function aseetaNopeeus() {
    var uusiIntervalli = parseInt(document.getElementById("nopeeus").value);
    if (uusiIntervalli == NaN) {
        uusiIntervalli = 10;
    }

    pakeetti.style.transition = "top " + uusiIntervalli / 1000 + "s, left " + uusiIntervalli / 1000 + "s";
    clearInterval(luuppi);
    alootaLuuppi(uusiIntervalli);
}


// Keksi pari satunnaista lukua
function haeSatuunnaisetKoordinaatit() {
    var y = pystyMarginaali / 2 + Math.floor(Math.random() * Math.floor(window.innerHeight - pystyMarginaali));
    var x = vaakaMarginaali / 2 + Math.floor(Math.random() * Math.floor(window.innerWidth - vaakaMarginaali));
    poloku.push([x, y]);
    return [x, y];
}


// Päivitä hymiöt
function lataaKuvaat() {
    twemoji.parse(document.body);
}


// Luo uusi demooni satunnaiseen paikkaan ja lisää se listaalle
function luoUusiDemooni(i) {
    var uusiDemooni = document.createElement("span");
    var uusiSijaainti = haeSatuunnaisetKoordinaatit();

    uusiDemooni.className = "demooni";
    uusiDemooni.innerHTML = teemat[teema].ikooni;
    uusiDemooni.style.left = uusiSijaainti[0];
    uusiDemooni.style.top = uusiSijaainti[1];
    uusiDemooni.setAttribute('onclick', "tapaDemooni(this)");

    verkkoaluue.appendChild(uusiDemooni);

    setTimeout(function() {
        heilutaVaseentaEtuuRaajaa(uusiDemooni);
    }, i);
}


// Poista demooni kaikkialta
function tapaDemooni(demooni, pakota = false) {
    if (teemat[teema].kuolevainen || pakota) {
        demooni.innerHTML = "&#x1F4A5;";
        demooni.classList.add("kuaallu");
        lataaKuvaat();
    }
}


// Ota demooni pois listoilta
function poistaDemooninPoloku(demooni) {
    poloku.splice(demooninIndeksi(demooni), 1);
}


// Testaile millä indeeksillä demooni on listalla
function demooninIndeksi(demooni) {
    var demoonit = document.getElementsByClassName("demooni");
    for (var i = 0; i < demoonit.length; i++) {
        if (demoonit[i] === demooni) {
            return i;
        }
    }
}


// Tapa kaikki
function tapaKaikki() {
    var demoonit = document.getElementsByClassName("demooni");
    Array.from(demoonit).forEach(demooni => {
        // Don't kill the ones that are already dead
        if (!demooni.classList.contains("kuaallu")){
          tapaDemooni(demooni, true);
        }
    });
}


// Heiluttele demooneita ruudulla, jotta ne näyttäväy leijuvan
function ravistaDemooneita() {
    var demoonit = document.getElementsByClassName("demooni");
    for (var i = 0; i < demoonit.length - 1; i++) {
        var y = Math.floor(Math.random() * Math.floor(40));
        var x = Math.floor(Math.random() * Math.floor(40));

        demoonit[i].style.left = poloku[i][0] + x;
        demoonit[i].style.top =  poloku[i][1] + y;
    }
}


// Laita pakeetti lentämään demoonilta toiselle
function liikutaPakeettia() {
    pakeetti.style.left = poloku[poloku.length - 1][0];
    pakeetti.style.top = poloku[poloku.length - 1][1];

    if (volyymit && teema == 0) {
        if (Math.round(Math.random()) % 2 == 0) {
            aaniteYkkonen.play();
        } else {
            aaniteKakkonen.play();
        }
    }
    
    if (teemat[teema].jahtaa) {
        var demoonit = document.getElementsByClassName("demooni");
        for (var i = 0; i < demoonit.length; i++) {
            demoonit[i].style.left = poloku[poloku.length - 1][0];
            demoonit[i].style.top = poloku[poloku.length - 1][1];
        }
    } else {
        if (document.getElementsByClassName("apinaaJumala").length > 0) {
            var demoonit = document.getElementsByClassName("demooni");
            var apinaaJumala = document.getElementsByClassName("apinaaJumala")[0];
            for (var i = 0; i < demoonit.length; i++) {
                demoonit[i].style.left = apinaaJumala.style.left;
                demoonit[i].style.top = apinaaJumala.style.top;
            }
        }
    }
}


// Ota teema käyttöön
function vaihaIkoonit() {
    var demoonit = document.getElementsByClassName("demooni");

    if (teema == teemat.length - 1) {
        teema = 0;
    } else {
        teema++;
    }

    pakeetti.innerHTML = teemat[teema].pakeetti;
    for (var i = 0; i < demoonit.length; i++) {
        demoonit[i].innerHTML = teemat[teema].ikooni;
    }

    lataaKuvaat();
}


function heilutaVaseentaEtuuRaajaa(kohdeDemooni) {
    if (teemat[teema].etuRaajatOmaava) {
        kohdeDemooni.childNodes[0].childNodes[0].style.transform = "rotate(-60deg)";
    }
}


// Apiinajumala tulee tappamaan kaikki ja suojelee apiinoita
function uhmaaApiinaJumalaa() {
    if (document.getElementsByClassName("apinaaJumala").length < 1){
        let demoonit = document.getElementsByClassName("demooni");
        let uhmaausLuku = Math.floor(Math.random() * 666);
        if (demoonit.length > uhmaausLuku) {
            let apiinaJumala = document.createElement("img");

            apiinaJumala.className = "apinaaJumala";
            apiinaJumala.src = "assets/ApiinaJumala.png";

            verkkoaluue.appendChild(apiinaJumala);
            tapaKaikki();

            var uhmaLuuppi = setInterval(function() {
                var y = -100 + Math.floor(Math.random() * Math.floor(200));
                var x = -100 + Math.floor(Math.random() * Math.floor(200));

                apiinaJumala.style.left = window.innerWidth / 2 + x;
                apiinaJumala.style.top = window.innerHeight / 2 + y;

                // Tappaako apiinajumaala jonkun demoonin?
                if (Math.floor(Math.random() * 7) > 4) tapaJoku();
            }, 100);

            setTimeout(function() {
                apiinaJumala.remove();
                clearInterval(uhmaLuuppi);
            }, 6666);
        }
    }
}


// Tapa joku
function tapaJoku() {
    let demoonit = document.getElementsByClassName("demooni");
    var satunnainenIndeeksi =  Math.floor(Math.random() * (demoonit.length + 1));

    tapaDemooni(demoonit[satunnainenIndeeksi]);
}


// Aloota
aluustaKaikki();
