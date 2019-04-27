/*
	Par : Shao Pradel-Tessier
	Fait le : 2019-01-24
	Projet 1 : Jeu du taquin, fichier javascript
*/

/*Variable globale de l'image*/
var img = new Image();
var source = randomImg();
img.src = source;

/*Fonction qui choisi une image aleatoirement*/
function randomImg(){
	var chemin = 'img/';
	var nbRandom = Math.floor(Math.random() * 5) + 1;
	var imageChoisie = chemin + nbRandom  + '.jpg';
	
	return imageChoisie;
}

/*Ajout de la musique*/
document.getElementById("music").src = "4. Unspoken.mp3";

/*Objet du jeu*/
var gameArea = {
	/*Attributs du jeu*/
	canvas : document.getElementById("canevas"),
	context : document.getElementById("canevas").getContext("2d"),
	click : new Object,
	clickx : 0,
	clicky : 0,
	/*Fontion start, qui commence le jeu*/
	start : function() {
		document.getElementById("image").src = source;	
	},
	/*Fonction qui efface le canvas*/
	clear : function() {
		this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
	}
}

/*Objet du plateau(canevas)*/
function Plateau(level,ctx)  {
	/*Attributs du plateau*/
	this.resolu = false;
	this.tileCount = level;
	this.ctx = ctx;
	this.tuiles = new Tuiles(this.tileCount);
	this.boardSize = document.getElementById("canevas").width;
	this.tileSize = this.boardSize / this.tileCount;
	
	/*Rafraichi le canevas*/
	this.rafraichi = function (){
		/*Efface ce qu'il y a dans le canevas et le redessine*/
		ctx.clearRect(0, 0, this.boardSize, this.boardSize);
		for (var i = 0; i < this.tileCount; i++) {
			for (var j = 0; j < this.tileCount; j++) {
				var x = this.tuiles.board[i][j].x;
				var y = this.tuiles.board[i][j].y;
				if(i != this.tuiles.tuileV.x || j != this.tuiles.tuileV.y || this.resolu == true) {
					ctx.drawImage(img, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize,
						i * this.tileSize, j * this.tileSize, this.tileSize, this.tileSize);
				}
			}
		}
	}
	/*Déplace la tuile vide vers la tuile choisie*/
	this.deplacer = function(versT, deT) {
		if(!this.resolu) {
			this.tuiles.board[versT.x][versT.y].x = this.tuiles.board[deT.x][deT.y].x;
			this.tuiles.board[versT.x][versT.y].y = this.tuiles.board[deT.x][deT.y].y;
			this.tuiles.board[deT.x][deT.y].x = this.tileCount - 1;
			this.tuiles.board[deT.x][deT.y].y = this.tileCount - 1;
			versT.x = deT.x;
			versT.y = deT.y;
			/*Vérifie si le plateau est réussi*/
			plateau.estReussi();
		}
	}
	/*Détermine si le puzzle est réussi ou non*/
	this.estReussi = function() {
		var flag = true;
		/*Vérifie si chaque tuile est à sa place*/
		for (var i = 0; i < this.tileCount; i++) {
			for (var j = 0; j < this.tileCount; j++) {
				if (this.tuiles.board[i][j].x != i || this.tuiles.board[i][j].y != j) {
				flag = false;
				}
			}
		}
		this.resolu = flag;
	}
}

/*Objet tuiles*/
function Tuiles(tileCount){
	/*Attributs de l'objet tuiles*/
	this.tuileV = new Object;
	this.tuileV.x = 0;
	this.tuileV.y = 0;
	this.board = new Array(tileCount);
	
	/*Crée des tuiles dans un tableau*/
	this.setTuiles = function() {
		for(var i = 0; i < tileCount; i++){
		this.board[i] = new Array(tileCount);
			for (var j = 0; j < tileCount; j++) {
				this.board[i][j] = new Object;
				this.board[i][j].x = i;
				this.board[i][j].y = j;
			}
		}
		/*Mélange les tuiles et détermine la tuile vide*/
		this.tuilesInit();
		this.initTuileV();
		
		/*Si le puzzle n'est pas realisable*/
		if(!this.estRealisable(tileCount, tileCount, this.tuileV.y + 1)){ //on rajoute un +1 (tableau est base sur 0)
			/*Si la tuile vide est positionnee aux 2 premiers endroits de la 1ere permutation,
				on permute les 2 dernieres tuiles*/
			if(this.tuileV.y == 0 && this.tuileV.x <= 1) {
				this.echanger(tileCount-2, tileCount -1, tileCount -1, tileCount -1);
			}
			else {
				this.echanger(0,0,1,0);
			}
			this.initTuileV();
		}
		plateau.rafraichi();
	}
	
	/*Fonction qui permet de permuter les tuiles avec la meme probabilitee(Fisher-Yates)*/
	this.tuilesInit = function(){
		var i = tileCount * tileCount - 1;
		/*Tant que i (le nombre de tuiles, moins la tuile vide) est plus grand que 0
			permute une tuile ayant un entier entre 0 et i et une autre tuile aléatoire*/
		while(i > 0){
			var j = Math.floor(Math.random() * i);
			var ai = i % tileCount;
			var bi = Math.floor(i/ tileCount);
			var aj = j % tileCount;
			var bj = Math.floor(j / tileCount);
			this.echanger(ai, bi, aj, bj);
			i--;
		}		
	}
	
	/*Permute 2 tuiles ensembles*/
	this.echanger = function(a, b, c, d){
		var tempo = new Object();
		tempo = this.board[a][b];
		this.board[a][b] = this.board[c][d];
		this.board[c][d] = tempo;
	}
	
	/*Fonction qui initialise la tuile vide dans le tableau*/
	this.initTuileV = function(){
		for(var j = 0; j < tileCount; j++){
			for(var i = 0; i < tileCount; i++){
				if(this.board[i][j].x == tileCount - 1 && this.board[i][j].y == tileCount - 1){
					this.tuileV.x = i;
					this.tuileV.y = j;
				}
			}
		}
	}
	
	/*Fonction qui verifie si le puzzle est realisable (Il faut que la permutation soit pair)*/
	this.estRealisable = function(largeur, hauteur, ligneV){
		if(largeur % 2 == 1){
			return(this.inversion() % 2 == 0);
		}
		/*Si le puzzle est pair, on additionne l'inversion avec la distance entre
			la ligne vide et la ligne du bas*/
		else {
			return((this.inversion() + hauteur - ligneV) % 2 == 0);
		}
	}
	
	/*Fonction qui calcule combien il y a d'inversions/permutation*/
	this.inversion = function(){
		var nbInversions = 0;
		for(var j = 0; j < tileCount; j++){
			for(var i = 0; i < tileCount; i++){
				nbInversions += this.addInv(i,j);
			}
		}
		return nbInversions;
	}
	
	/*Fonction qui calcule la somme d'inversion pour le puzzle au complet*/
	this.addInv = function(i,j){
		var inversions = 0;
		var numero = j * tileCount + i;
		var dernierT = tileCount * tileCount;
		var valeurT = this.board[i][j].y* tileCount + this.board[i][j].x;
		
		for(var x = numero+1; x < dernierT; x++){
			var a = x % tileCount;
			var b = Math.floor(x / tileCount);
			var valeur = this.board[a][b].y * tileCount + this.board[a][b].x;
			if(valeurT > valeur && valeurT != (dernierT -1)){
				inversions++;
			}
		}
		return inversions;
	}
	
}

/*Fonction qui calcule la distance entre x1 et x2*/
function distance(x1, y1, x2, y2){
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/*Fonction qui démarre le jeu*/
function start(level){
	gameArea.start();
	plateau = new Plateau(level, gameArea.context);
	plateau.tuiles.setTuiles();
	
	/*Gestion de mouvement de souris*/
	document.getElementById('canevas').onmousemove = function(e) {
		gameArea.click.x = Math.floor((e.pageX - this.offsetLeft) / plateau.tileSize);
		gameArea.click.y = Math.floor((e.pageY - this.offsetTop) / plateau.tileSize);
	}; 
	/*Gestion de clic de souris*/
	document.getElementById('canevas').onclick = function() {
		if(distance(gameArea.click.x, gameArea.click.y, plateau.tuiles.tuileV.x, plateau.tuiles.tuileV.y) == 1) {
			plateau.deplacer(plateau.tuiles.tuileV, gameArea.click);
			plateau.rafraichi();
		}
		if(plateau.resolu) {
			setTimeout(function() {alert("Bravo! Vous avez réussi le puzzle!");}, 500);
		}
	}
}