
//------------------------------------------------------LOGIN------------------------------------------------------//

clientToServer = {
    username: "nome della classe",
    password: "password della classe"
}

serverToClient = {
    sent: true, //Questo è un valore status, se le credenziali sono corrette, set a true, se sono sbagliate, a false
    message: "Messaggio da mostrare all'utente" //Questa stringa va sempre mostrata all'utente, esempio sono "credenziali sbagliate" / "login effettuato"
}






//----------------------------------------INVIO ORDINE DA PARTE DI UNA CLASSE---------------------------------------//

clientToServer = {
    credentials: {
        username: "nome della classe",
        password: "password della classe"
    },
    order: {} //Oggetto dell'ordine, questo è quello che va convertito in stringa e messo nel database
}

serverToClient = {
    sent: true, //Questo è un valore status, se le credenziali sono corrette, set a true, se sono sbagliate, a false
    message: "Messaggio da mostrare all'utente" //Questa stringa va sempre mostrata all'utente, esempio sono "credenziali sbagliate" / "login effettuato"
}






//------------------------------------ --RECEZIONE DI ORDINI DA PARTE DEL PANINARO----------------------------------//

//-----------per prendere gli ordini---------//

clientToServer = {
    username: "nome del paninaro",
    password: "password del paninaro"
}

serverToClient = {
    sent: true, //Questo è un valore status, se le credenziali sono corrette, set a true, se sono sbagliate, a false
    message: [] //Array di oggetti, ogni oggetto nell'array è un ordine, sarebbero tutti gli ordini piazzati dagli utenti che sono nel database
}

//-----------per rimuovere un ordine----------//

clientToServer = {
    username: "nome del paninaro",
    password: "password del paninaro",
    name: "nome della classe il cui ordine va eliminato"
}

serverToClient = {
    sent: true, //Questo è un valore status, se le credenziali sono corrette, set a true, se sono sbagliate, a false
    message: "Messaggio da mostrare all'utente" //Questa stringa va sempre mostrata all'utente, esempio sono "credenziali sbagliate" / "login effettuato"
}

