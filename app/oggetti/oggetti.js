function randomInteger(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
 }


function Armata(colore) {
	this.X = 0;
	this.Y = 0;
	this.colore = colore;
	this.spostare = function(coord){
		this.X = coord[0];
		this.Y = coord[1];
	}
}

function Carta(territorio, figura) {
	this.territorio = territorio;
	this.figura = figura;
}

function CartaObiettivo(id, testo) {
	this.id = id;
	this.testo = testo;
}

function Territorio(nome, vicini, posto) {
	this.nome = nome;
	this.vicini = vicini;
	this.postoPerArmate = posto;
	this.armate = [];
}

function Continente(nome, territori) {
	this.nome = nome;
	this.territori = territori;
}

function Mondo(continenti) {
	this.continenti = continenti;
}

function Giocatore(nome, colore) {
	this.nome = nome;
	this.colore = colore;
	this.killer = "";
	this.continenti = [];
	this.carte = [];
	this.cartaObiettivo = {};
	this.armate = [];
	this.territori = [];

	this.mettereArmate = function(postoNome) {
		for (var i = 0; i < this.territori.length; i++) {
			if(this.territori[i].nome == postoNome){
				let posto = this.territori[i];
				if(this.armate.length > 0){
					let armata = this.armate.pop();
					armata.spostare(posto.postoPerArmate);
					posto.armate.push(armata);
				}
			}
		}
	};
}




