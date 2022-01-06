//inicializando o jogo
function jogar(){

//oculta div inicioJogo
	$("#inicioJogo").hide();
	
//adiciona div dos personagens, placar e barra de energia
	$("#fundoJogo").append("<div id='jogador' class='anima-jogador'></div>");
	$("#fundoJogo").append("<div id='inimigo1' class='anima-inimigo1'></div>");
	$("#fundoJogo").append("<div id='inimigo2'></div>");
	$("#fundoJogo").append("<div id='amigo' class='anima-amigo'></div>");
	$("#fundoJogo").append("<div id='placar'></div>");
	$("#fundoJogo").append("<div id='energia'></div>");

//variáveis principais
    const jogo = {};
	jogo.pressionou = [];
	jogo.tecla = {W: 87,S: 83,D: 68}
	jogo.velocidade1 = 5;
	jogo.velocidade2 = 3;
    jogo.posicaoY = getPosicaoVertical();
	jogo.posicaoX = 0;
	jogo.topo = 0;
	jogo.liberarDisparo = true;
	jogo.fimDeJogo = false;
	jogo.pontos = 0;
    jogo.salvos = 0;
    jogo.perdidos = 0;
	jogo.energiaAtual = 3;
	jogo.somDisparo = document.getElementById("somDisparo");
    jogo.somExplosao = document.getElementById("somExplosao");
    jogo.musica = document.getElementById("musica");
    jogo.somFimDoJogo = document.getElementById("fimDoJogo");
    jogo.somPerdido = document.getElementById("somPerdido");
    jogo.somResgate = document.getElementById("somResgate");

//rodando a música de fundo
    jogo.musica.addEventListener("ended", ()=>{ musica.currentTime = 0; musica.play(); }, false);
    jogo.musica.play();
	
//verificando se o usuário pressionou alguma tecla
	$(document).keydown(function(e){
		jogo.pressionou[e.which] = true;
   });
   
   $(document).keyup(function(e){
	   jogo.pressionou[e.which] = false;
   });
	
//função principal
	jogo.main = setInterval(()=>{
	//Game Loop
	    if(jogo.fimDeJogo == false){
		    moveCenario();
		    moveJogador();
		    moveInimigo1();
		    moveInimigo2();
		    moveAmigo();
		    colisao();
		    placar();
		    energia();
	    }
		
	},30);
	

//função que movimenta o fundo do jogo
    function moveCenario(){
		let esquerda = parseInt($("#fundoJogo").css("background-position"));
	    $("#fundoJogo").css("background-position",esquerda-1);
	} 

//função que movimenta o jogador
    function moveJogador(){
		jogo.topo = parseInt($("#jogador").css("top"));
		let move;
		if (jogo.pressionou[jogo.tecla.W] && jogo.topo >= 10){
			move = jogo.topo - 10;
		}else if(jogo.pressionou[jogo.tecla.S] && jogo.topo <= 434){
			move = jogo.topo + 10;
		}else if (jogo.pressionou[jogo.tecla.D]){
			efetuarDisparo();
		}

		$("#jogador").css("top",move);
	}

//função que retorna a posiciação vertical aleatória
    function getPosicaoVertical(){
	    return parseInt(Math.random() * 334);
    }

//função que movimenta o inimigo1
	function moveInimigo1(){
		jogo.posicaoX = parseInt($("#inimigo1").css("left"));
		if(jogo.posicaoX > 0){
		    $("#inimigo1").css("left",jogo.posicaoX - jogo.velocidade1);
		    $("#inimigo1").css("top",jogo.posicaoY);
	    }else{
			jogo.posicaoY = getPosicaoVertical();
			$("#inimigo1").css("left",694);
			$("#inimigo1").css("top",jogo.posicaoY);	
		}
	}

//função que movimenta o inimigo2
    function moveInimigo2(){
	    jogo.posicaoX= parseInt($("#inimigo2").css("left"));
		if(jogo.posicaoX > 0 ){
            $("#inimigo2").css("left",jogo.posicaoX - jogo.velocidade2);	
	    }else{
	        $("#inimigo2").css("left",775);			
	    }
    }

//função que movimenta o amigo
    function moveAmigo() {
		jogo.posicaoX = parseInt($("#amigo").css("left"));
		if(jogo.posicaoX <= 906){
	        $("#amigo").css("left",jogo.posicaoX + 1);	
		}else{	
			$("#amigo").css("left",0);			
		}
    } 

//função para efetuar disparo de arma no inimigo
    function efetuarDisparo() {
	    if (jogo.liberarDisparo == true) {
			jogo.somDisparo.play();
	        jogo.liberarDisparo = false;
	        jogo.topo = parseInt($("#jogador").css("top"))
	        jogo.posicaoX = parseInt($("#jogador").css("left"))
	        let disparoX = jogo.posicaoX + 190;
	        let topoDisparo = jogo.topo + 37;
	        $("#fundoJogo").append("<div id='disparo'></div");
	        $("#disparo").css("top",topoDisparo);
	        $("#disparo").css("left",disparoX);
	
	        let tempoDisparo = setInterval(()=>{
			//executa disparo
				jogo.posicaoX = parseInt($("#disparo").css("left"));
	            $("#disparo").css("left",jogo.posicaoX+15); 
        		if (jogo.posicaoX > 900) {		
			        clearInterval(tempoDisparo);
			        tempoDisparo = null;
			        $("#disparo").remove();
			        jogo.liberarDisparo = true;
				}
			}, 30);
	    }
    }

//função para verificar colisão
	function colisao() {
		let colisao1 = ($("#jogador").collision($("#inimigo1")));
		let colisao2 = ($("#disparo").collision($("#inimigo1")));
		let colisao3 = ($("#jogador").collision($("#inimigo2")));
        let colisao4 = ($("#disparo").collision($("#inimigo2")));
        let colisao5 = ($("#jogador").collision($("#amigo")));
        let colisao6 = ($("#inimigo2").collision($("#amigo")));
		let inimigo1X;
		let inimigo1Y;
		let inimigo2X;
		let inimigo2Y;
		let amigoX;
		let amigoY;

    //jogador com inimigo1
		if (colisao1.length > 0){
			jogo.energiaAtual --;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1e2(inimigo1X,inimigo1Y,"explosao1");
			reposicionaInimigo1();
		}

	//disparo no inimigo1
		if (colisao2.length > 0){
			jogo.pontos += 100;
			jogo.velocidade1 += 0.3;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1e2(inimigo1X,inimigo1Y,"explosao1");
			$("#disparo").css("left",950);
			reposicionaInimigo1();	
		}

	//jogador com o inimigo2 
        if (colisao3.length > 0){
			jogo.energiaAtual --;
		    inimigo2X = parseInt($("#inimigo2").css("left"));
		    inimigo2Y = parseInt($("#inimigo2").css("top"));
		    explosao1e2(inimigo2X,inimigo2Y,"explosao2");	
		    $("#inimigo2").remove();
		    reposicionaInimigo2();
		}

	//disparo no inimigo2
	    if (colisao4.length > 0){
			jogo.pontos += 50;
		    inimigo2X = parseInt($("#inimigo2").css("left"));
		    inimigo2Y = parseInt($("#inimigo2").css("top"));
			$("#inimigo2").remove();
		    explosao1e2(inimigo2X,inimigo2Y,"explosao2");
			$("#disparo").css("left",950);
		    reposicionaInimigo2();
		}

	//jogador com o amigo	
	    if (colisao5.length > 0){
			jogo.somResgate.play();
			jogo.salvos ++;
		    reposicionaAmigo();
		    $("#amigo").remove();
		}

	//inimigo2 com o amigo
	    if (colisao6.length > 0){
			jogo.perdidos ++;
			amigoX = parseInt($("#amigo").css("left"));
		    amigoY = parseInt($("#amigo").css("top"));
		    explosao3(amigoX,amigoY);
		    $("#amigo").remove();		
		    reposicionaAmigo();	
		}

	}

//função para explosão da colisão entre jogador e inimigo1 ou inimigo2
	function explosao1e2(inimigoX,inimigoY,explosao) {
		jogo.somExplosao.play();
		$("#fundoJogo").append("<div id='"+explosao+"'></div");
		$("#"+explosao).css("background-image", "url(imgs/explosao.png)");
	    let div = $("#"+explosao);
		div.css("top", inimigoY);
		div.css("left", inimigoX);
		div.animate({width:200, opacity:0}, "slow");

		let tempoExplosao = setInterval(()=>{
		//remove explosão
			div.remove();
			clearInterval(tempoExplosao);
			tempoExplosao = null;
		}, 1000);
			
	}

//função para explosão da colisão entre amigo e inimigo2
    function explosao3(amigoX,amigoY) {
		jogo.somPerdido.play();
	    $("#fundoJogo").append("<div id='explosao3' class='anima4'></div");
	    $("#explosao3").css("top",amigoY);
	    $("#explosao3").css("left",amigoX);

	    let tempoExplosao = setInterval(()=>{
		//remove explosão
			$("#explosao3").remove();
	        clearInterval(tempoExplosao3);
	        tempoExplosao = null;
		}, 1000);
	} 

//funcão que reposiona inimigo1 após disparo
   function reposicionaInimigo1(){
	   jogo.posicaoY = parseInt(Math.random() * 334);
	   $("#inimigo1").css("left",694);
	   $("#inimigo1").css("top",jogo.posicaoY);
   }

//funcão que reposiona inimigo2, 5 segundos, após disparo
    function reposicionaInimigo2(){
		let tempoColisao = setInterval(()=>{
			clearInterval(tempoColisao);
			tempoColisao = null;
			if(jogo.fimDeJogo == false){
				$("#fundoJogo").append("<div id='inimigo2'></div");
			}
		}, 5000);
    }

//função que reposiciona amigo após 6 segundos
    function reposicionaAmigo(){
	    let tempoAmigo = setInterval(()=>{
			clearInterval(tempoAmigo);
		    tempoAmigo  = null;
		    if (jogo.fimDeJogo == false){
		        $("#fundoJogo").append("<div id='amigo' class='anima-amigo'></div>");
		    }
		}, 6000);	
    }

//função para exibição do placar
    function placar() {
        $("#placar").html("<h2> Pontos: " + jogo.pontos + " Salvos: " + jogo.salvos + " Perdidos: " + jogo.perdidos + "</h2>");
	}

//função para exibição da barra de energia do jogador
    function energia() {
	    if(jogo.energiaAtual==3){
		    $("#energia").css("background-image", "url(imgs/energia3.png)");
	    }else if(jogo.energiaAtual==2){
		    $("#energia").css("background-image", "url(imgs/energia2.png)");
	    }else if(jogo.energiaAtual==1){
			$("#energia").css("background-image", "url(imgs/energia1.png)");
	    }else if(jogo.energiaAtual==0){
		    $("#energia").css("background-image", "url(imgs/energia0.png)");
		    fimDeJogo();
	    }
    }

//função fim do jogo
    function fimDeJogo(){
	    jogo.fimDeJogo = true;
	    jogo.musica.pause();
	    jogo.somFimDoJogo.play();
	    $("#jogador").remove();
	    $("#inimigo1").remove();
	    $("#inimigo2").remove();
	    $("#amigo").remove();
	    $("#fundoJogo").append("<div id='fim'></div>");
	    $("#fim").html("<h1>Fim de Jogo</h1><p>Sua pontuação foi: " + jogo.pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
	} 

}

//função para reiniciar o jogo após o término
function reiniciaJogo() {
	document.getElementById("fimDoJogo").pause();
	$("#fim").remove();
	jogar();
}

