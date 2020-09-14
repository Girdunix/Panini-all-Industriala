let ordine = {
    price: 0,
    date: 0,
    order: {
        pizze: [{
            name: "",
            description: "",
            quantity: 0,
            price: 0,
            id: "Panino_" //non obbligatorio
        }],
        panini: [],
        dolci: []
    }
}
let esempioOrdine = {
    price: 4.2,
    date: Date.now(), //in millisecondi
    order: {
        pizze: [{
                name: "Ventricina",
                quantity: 2,
                price: 2,
                id: 3
            },
            {
                name: "Margherita",
                quantity: 1,
                price: 1,
                id: 2
            }
        ],
        panini: [{
            name: "Ventricina farcito",
            quantity: 1,
            price: 1.2,
            id: 8
        }],
        dolci: []
    }
}


//---------------------------------------//

async function getDati(){
    let dati = await fetch("./data/menu.json").then(data => data.json())
    console.log(dati)
}
getDati()