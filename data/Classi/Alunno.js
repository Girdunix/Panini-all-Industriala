module.exports = class Alunno {
    constructor(argomenti){
        this.id = argomenti[0]
        this.nome = argomenti[1]
        this.cognome = argomenti[2]
        this.classe = argomenti[3]
        this.nomeCognome = this.nome + " " + this.cognome
    } 
}