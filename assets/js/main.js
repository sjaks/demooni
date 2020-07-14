var net = document.getElementById("pakeetti-poloku");
var pakeetti = document.getElementById("pakeetti");
var poloku = [];
var luuppi;
var pystyMarginaali = 200;
var vaakaMarginaali = 100;


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


function aluustaKaikki() {
    pakeetti.style.top = window.innerHeight / 2;
    pakeetti.style.left = window.innerWidth / 2;
    lataaKuvaat();
    alootaLuuppi(1000);
}


function alootaLuuppi(i) {
    luuppi = setInterval(function() {
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


function aseetaNopeeus() {
    var newInterval = parseInt(document.getElementById("nopeeus").value);
    if (newInterval == NaN) {
        newInterval = 10;
    }

    pakeetti.style.transition = "top " + newInterval / 1000 + "s, left " + newInterval / 1000 + "s";
    clearInterval(luuppi);
    alootaLuuppi(newInterval);
}


function haeSatuunnaisetKoordinaatit() {
    var y = pystyMarginaali / 2 + Math.floor(Math.random() * Math.floor(window.innerHeight - pystyMarginaali));
    var x = vaakaMarginaali / 2 + Math.floor(Math.random() * Math.floor(window.innerWidth - vaakaMarginaali));
    poloku.push([x, y]);
    return [x, y];
}


function lataaKuvaat() {
    twemoji.parse(document.body);
}


function luoUusiDemooni(i) {
    var uusiDemooni = document.createElement("span");
    var uusiSijaainti = haeSatuunnaisetKoordinaatit();

    uusiDemooni.className = "demooni";
    uusiDemooni.innerHTML = teemat[teema].ikooni;
    uusiDemooni.style.left = uusiSijaainti[0];
    uusiDemooni.style.top = uusiSijaainti[1];
    uusiDemooni.setAttribute('onclick', "tapaDemooni(this)");

    net.appendChild(uusiDemooni);

    setTimeout(function() {
        heilutaVaseentaEtuuRaajaa(uusiDemooni);
    }, i);
}


function tapaDemooni(demooni, pakota = false) {
    if (teemat[teema].kuolevainen || pakota) {
        demooni.innerHTML = "&#x1F4A5;";
        lataaKuvaat();
        setTimeout(function(){
            poistaDemooninPoloku(demooni);
            demooni.remove()
        }, 1000);
    }
}


function poistaDemooninPoloku(demooni) {
    poloku.splice(demooninIndeksi(demooni), 1);
}


function demooninIndeksi(demooni) {
    var demoonit = document.getElementsByClassName("demooni");
    for (var i = 0; i < demoonit.length; i++) {
      if (demoonit[i] === demooni) {
        return i;
      }
    }
}


function tapaKaikki() {
    var demoonit = document.getElementsByClassName("demooni");
    Array.from(demoonit).forEach(demooni => {
        tapaDemooni(demooni, true);
    });
}


function ravistaDemooneita() {
    var demoonit = document.getElementsByClassName("demooni");
    for (var i = 0; i < demoonit.length - 1; i++) {
        var y = Math.floor(Math.random() * Math.floor(40));
        var x = Math.floor(Math.random() * Math.floor(40));

        demoonit[i].style.left = poloku[i][0] + x;
        demoonit[i].style.top =  poloku[i][1] + y;
    }
}


function liikutaPakeettia() {
    pakeetti.style.left = poloku[poloku.length - 1][0];
    pakeetti.style.top = poloku[poloku.length - 1][1];

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


function uhmaaApiinaJumalaa() {
    if (document.getElementsByClassName("apinaaJumala").length < 1){
        let demoonit = document.getElementsByClassName("demooni");
        let uhmaausLuku = Math.floor(Math.random() * 666);
        if (demoonit.length > uhmaausLuku) {
            let apiinaJumala = document.createElement("img");

            apiinaJumala.className = "apinaaJumala";
            apiinaJumala.src = "assets/ApiinaJumala.png";

            net.appendChild(apiinaJumala);
            tapaKaikki();

            var uhmaLuuppi = setInterval(function() {
                var y = -100 + Math.floor(Math.random() * Math.floor(200));
                var x = -100 + Math.floor(Math.random() * Math.floor(200));

                apiinaJumala.style.left = window.innerWidth / 2 + x;
                apiinaJumala.style.top = window.innerHeight / 2 + y;
            }, 100);

            setTimeout(function() {
                apiinaJumala.remove();
            }, 6666);
        }
    }
}

// Aloota
aluustaKaikki();