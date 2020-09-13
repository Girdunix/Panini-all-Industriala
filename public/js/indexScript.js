let textareaAlunni = document.getElementById("textareaAlunni")
async function getDatiAlunni(){
    let dati = await fetch("/getDatiAlunni").then(dati => dati.json())
    textareaAlunni.value = JSON.stringify(dati).split("},").join("},\n\n")
    console.log(dati)
}
/*
Leggera spiegazione su cosa è async/await/.then

è la cosa più difficile da capire in javascript, in pratica non tutto è svolto in maniera immediata. 
per esempio, se il browser deve prendere un file dal server, deve aspettare che il server risponda, non si sa quanto tempo
può impiegare, per questo motivo esistono le funzioni asincrone (iniziano con async), esse vengono eseguite in maniera non sincroena
await invece vuol dire che aspetta che un qualcosa sia finito. 

Tutto questo si chiama PROMISE , qui sotto scrivo qualche esempio
*/

function esempioPromise(){
    return new Promise((risolvi, getta) =>{
        setTimeout(function(){
            risolvi("Risolta in 1000ms!")
        },1000)
    })
}

async function funzioneAsincrona(){
    console.log(await esempioPromise())
}
function funzioneSincrona(){
    console.log("sincrona")
}
funzioneAsincrona()
funzioneSincrona()

setTimeout(() =>{
    console.log("/////////")
    eseguiSincroni()
},1500)    
async function eseguiSincroni(){
    await funzioneAsincrona()
    funzioneSincrona()
}