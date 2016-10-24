var GIOCO = (function () {
	var _carte = [];
	var _carteObiettivi = [];
	var _giocatori = [];
	var _continente = [];

	var _load = function (giocatori, quantitaArmate) {
		//caricare array catre da lista
		for (let j = 0; j < listCarte.length; j++) {
			_carte.push(new Carta(listCarte[j].territorio, listCarte[j].figura));
		}

		//caricare array continente da lista
		for (let i = 0; i < listContinente.length; i++) {
			let continente = listContinente[i];
			_continente.push(new Continente(continente.nome, continente.territori));
		}

		//caricare array catre obiettivi da lista
		for (var cob = 0; cob < listObiettivi.length; cob++) {
			let cartaObiettivo = listObiettivi[cob];
			let carta = new CartaObiettivo(cartaObiettivo.id, cartaObiettivo.testo);
			_carteObiettivi.push(carta);
		}
		
		//distribuzione giocatori
		for (let i = 0; i < giocatori.length; i++) {
			let giocatore = giocatori[i];
			_giocatori.push(new Giocatore(giocatore.nome, giocatore.colore));
			for (let a = 0; a < quantitaArmate; a++) {
				_giocatori[i].armate.push(new Armata(_giocatori[i].colore));
			}			
		}


		 _giocatori = randomOrdinare(_giocatori);

		//distribuzione di carte obiettivi
		for (var ob = 0; ob < _giocatori.length; ob++) {
			let rand = randomInteger(0, _carteObiettivi.length);
			_giocatori[ob].cartaObiettivo = _carteObiettivi[rand];
			_carteObiettivi.splice(rand, 1);
		}

		//distribuzione di carte
		while(_carte.length > 0) {
			for (var c = 0; c < _giocatori.length; c++) {
				let rand = randomInteger(0, _carte.length);
				if(_carte.length > 0){
					_giocatori[c].carte.push(_carte[rand]); 
					_carte.splice(rand, 1);
				}
			}		
		}	

		//aree di distribuzione, in conformità con le carte
		for (let tg = 0; tg < _giocatori.length; tg++) {
			let giocatore = _giocatori[tg];
			for (let t = 0; t < listTerritori.length; t++) {
				let territorio = listTerritori[t];
				for(let gc = 0; gc < giocatore.carte.length; gc++){
					let carta = giocatore.carte[gc];
					if(territorio.nome == carta.territorio){
						giocatore.territori.push(new Territorio(territorio.nome, territorio.vicini, territorio.postoPerArmate));
						_carte.push(carta);
						giocatore.carte.splice(gc, 1);
					}
					if(carta.territorio == ""){
						_carte.push(carta);
						giocatore.carte.splice(gc, 1);
					}
			 	}
			}
		}

		//mettere armati sul territori
		for (let i = 0; i < _giocatori.length; i++) {
			let giocatore = _giocatori[i];
			for (let j = 0; j < giocatore.territori.length; j++) {
				let territorio = giocatore.territori[j];
				giocatore.mettereArmate(territorio.nome);
			}
		}

	};

	var _init = function() {
		let flag = true;
		let giocatoreVin = {};
		let TURNO = 1;

		introPosizionamentoArm(_giocatori);
															
		while(flag){
			for (let i = 0; i <  _giocatori.length; i++) {
				let giocatore = _giocatori[i];
				controllaGiocatore(giocatore, _continente);
				flag = provareObiettivo(giocatore, _giocatori);
				if(!flag) {
					giocatoreVin = _giocatori[i];
					break;
				}
				if(TURNO > 1){
					conteggioArmate(giocatore);
					if(TURNO >= 3) {
						controllaCarte(giocatore);
					}
					posizionamentoArm(giocatore);
				}
				let atac = true;
				while(atac) {
					ataccare();
					atac = confirm(""); 
				}


				controllaGiocatore(giocatore, _continente);
				flag = provareObiettivo(giocatore, _giocatori);
				if(!flag) {
					giocatoreVin = _giocatori[i];
					break;
				}
				TURNO++;
			}
			flag = false;
		}

		document.write(`CONGRATULAZIONE!!! ${giocatoreVin.nome}`);
	};

	var _showGiocatore = function(nome) {
		for (var i = 0; i < _giocatori.length; i++) {
			if(_giocatori[i].nome == nome) 
				return _giocatori[i];
		}
	};

	var _showGiocatori = function() {
		return _giocatori;
	}

	return {
		load: _load,
		init: _init,
		showGiocatore: _showGiocatore,
		showGiocatori: _showGiocatori
	};
})();

function randomOrdinare(giocatori) {
	let tempArr = [];
	let length = giocatori.length;
	for (let i = 0; i < length; i++) {
		let rand = randomInteger(0, giocatori.length);
		tempArr.push(giocatori[rand]);
		giocatori.splice(rand, 1);
	}
	return tempArr;
}


function ObjectIndexOf(myArray, searchTerm, property) {
    for(let i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function controllaGiocatore(giocatore, continenti) {
	var freq = new Array(6);
	freq.fill(0);
	for (let i = 0; i < continenti.length; i++) {
		let terLen = giocatore.territori.length;
		for (let k = 0; k < terLen; k++) {
			let terNom = giocatore.territori[k].nome;
			if(continenti[i].territori.indexOf(terNom) >= 0){
				freq[i] += 1;
			}
		}
		if(freq[i] == continenti[i].territori.length) {
			giocatore.continenti.push(continenti[i].nome);
		}
	}

}

function conteggioArmate(giocatore) {
	let armate = 0;
	armate += Math.floor(giocatore.territori.length / 3);
	if(giocatore.continenti.length != 0) {
		for (let i = 0; i < giocatore.continenti.length; i++) {
			switch(giocatore.continenti[i]) {
				case "Asia": armate += 7; break;
				case "Africa": armate += 3; break;
				case "Europa": armate += 5; break;
				case "Oceania": armate += 2; break;
				case "Nord_America": armate += 5; break;
				case "Sud_America": armate += 2; break;
			}
		}
	}
	for (var i = 0; i < armate; i++) {
		giocatore.armate.push(new Armata(giocatore.colore));		
	}
}

function controllaCarte(giocatore) {
	let carteLen = giocatore.carte.length;
	if(carteLen >= 3) {
		let contCartDiver = new Array(carteLen); contCartDiver.fill("");
		let contCartUgv = new Array(carteLen);	contCartUgv.fill("");
		for (let i = 0; i < carteLen; i++) {
			let carta = giocatore.carte[i];
			if(contCartDiver.indexOf(carta.figura) < 0) {
				contCartDiver.push(carta.figura);
			}
		}
	}
}

function introPosizionamentoArm(giocatori) {
	let arr = new Array(6);
	let flag = true;
	while(flag) {
		for (let i = 0; i < giocatori.length; i++) {
			arr[i] = giocatori[i].armate.length;
			if(giocatori[i].armate.length == 0) {
				continue;
			} else {
				let testo = "";
				for (let j = 0; j < giocatori[i].territori.length; j++) {
					testo += "; " + giocatori[i].territori[j].nome;
				}
				let posto = prompt(`${giocatori[i].nome} ha ${giocatori[i].armate.length} dove metti? ${testo}`, "");
				let index = ObjectIndexOf(giocatori[i].territori, posto, "nome");
				if(index >= 0) {
					giocatori[i].mettereArmate(posto);
				}
			}
		}
		for (let k = 0; k < arr.length; k++) {
			if(flag = (arr[k] > 0)) break;
		}
	}
}

function posizionamentoArm(giocatore) {
	let armata = [];
	while(giocatore.armate.length > 0) {
		let quant = prompt(`Quantita armate?`, "");
		let testo = "";
		for (let j = 0; j < giocatore.territori.length; j++) {
			testo += "; " + giocatore.territori[j].nome;
		}
		let posto = prompt(`Dove metti? ${testo}`, "");
		for (let k = 0; k < quant; k++) {
			let index = ObjectIndexOf(giocatore.territori, posto, "nome");
			if(index  >= 0){
				giocatore.mettereArmate(posto);
			}
		}
	}
}

function provareObiettivo(giocatore, giocatori) {
	let flag = false;
	let idObiettivo = giocatore.cartaObiettivo.id;
	let continenti = giocatore.continenti;
	let territoriLenth = giocatore.territori.length;
	let colore = giocatore.colore;
	switch(idObiettivo) {
		case "0" : {
			if(territoriLenth >= 18){
				let contatore = 0;
				for (let i = 0; i < territoriLenth; i++) {
					if(giocatore.territori[i].armate.length >= 2) {
						contatore++;
					}
				}
				if(contatore >= 18) {
					flag = true;
				}
			}
			break;
		}
		case "1" : {
			if(territoriLenth >= 24){
				flag = true;
			}
			break;
		}
		case "2" : {
			if(colore == "blu" || giocatore.cartaObiettivo.alternativa == true){
				if(territoriLenth >= 24){
					flag = true;
				}
			} else {
				for (let i = 0; i < giocatori.length; i++) {
					if(giocatori[i].colore == "blu" && giocatori[i].killer == colore ) {
						flag = true;
					} else {
						if(giocatori[i].colore == "blu" && giocatori[i].killer != "") {
							giocatore.cartaObiettivo.alternativa = true;
						}
					}
				}
			}
			break;
		}
		case "3" : {
			if(colore == "verde" || giocatore.cartaObiettivo.alternativa == true){
				if(territoriLenth >= 24){
					flag = true;
				}
			} else {
				for (let i = 0; i < giocatori.length; i++) {
					if(giocatori[i].colore == "verde" && giocatori[i].killer == colore ) {
						flag = true;
					} else {
						if(giocatori[i].colore == "verde") {
							giocatore.cartaObiettivo.alternativa = true;
						}
					}
				}
			}
			break;
		}
		case "4" : {
			if(colore == "viola" || giocatore.cartaObiettivo.alternativa == true){
				if(territoriLenth >= 24){
					flag = true;
				}
			} else {
				for (let i = 0; i < giocatori.length; i++) {
					if(giocatori[i].colore == "viola" && giocatori[i].killer == colore ) {
						flag = true;
					} else {
						if(giocatori[i].colore == "viola") {
							giocatore.cartaObiettivo.alternativa = true;
						}
					}
				}
			}
			break;
		}
		case "5" : {
			if(colore == "rosso" || giocatore.cartaObiettivo.alternativa == true){
				if(territoriLenth >= 24){
					flag = true;
				}
			} else {
				for (let i = 0; i < giocatori.length; i++) {
					if(giocatori[i].colore == "rosso" && giocatori[i].killer == colore ) {
						flag = true;
					} else {
						if(giocatori[i].colore == "rosso") {
							giocatore.cartaObiettivo.alternativa = true;
						}
					}
				}
			}
			break;
		}
		case "6" : {
			if(colore == "nero" || giocatore.cartaObiettivo.alternativa == true){
				if(territoriLenth >= 24){
					flag = true;
				}
			} else {
				for (let i = 0; i < giocatori.length; i++) {
					if(giocatori[i].colore == "nero" && giocatori[i].killer == colore ) {
						flag = true;
					} else {
						if(giocatori[i].colore == "nero") {
							giocatore.cartaObiettivo.alternativa = true;
						}
					}
				}
			}
			break;
		}
		case "7" : {
			if(colore == "giallo" || giocatore.cartaObiettivo.alternativa == true){
				if(territoriLenth >= 24){
					flag = true;
				}
			} else {
				for (let i = 0; i < giocatori.length; i++) {
					if(giocatori[i].colore == "giallo" && giocatori[i].killer == colore ) {
						flag = true;
					} else {
						if(giocatori[i].colore == "giallo") {
							giocatore.cartaObiettivo.alternativa = true;
						}
					}
				}
			}
			break;
		}
		case "8" : {
			if(continenti.indexOf("Asia") >= 0 && continenti.indexOf("Africa") >= 0){
				flag = true;
			}
			break;
		}
		case "9" :  {
			if(continenti.indexOf("Europa") >= 0 && continenti.indexOf("Oceania") >= 0 && continenti.length >= 3){
				flag = true;
			}
			break;
		}
		case "10" : {
			if(continenti.indexOf("Nord_America") >= 0 && continenti.indexOf("Oceania") >= 0){
				flag = true;
			}
			break;
		}
		case "11" : {
			if(continenti.indexOf("Asia") >= 0 && continenti.indexOf("Sud_America") >= 0){
				flag = true;
			}
			break;
		}
		case "12" : {
			if(continenti.indexOf("Europa") >= 0 && continenti.indexOf("Sud_America") >= 0 && continenti.length >= 3){
				flag = true;
			}
			break;
		}
		case "13" : {
			if(continenti.indexOf("Nord_America") >= 0 && continenti.indexOf("Africa") >= 0){
				flag = true;
			}
			break;
		}
	}
	return !flag;
}