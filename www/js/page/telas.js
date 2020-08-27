/*----------------------------------------------------------------------------------------*/
/*                                   Váriaveis Globais                                    */
/*----------------------------------------------------------------------------------------*/
 var Formulario = new Formulario();
 var Util = new Util();
 var Listas = new Listas();
 var confirmados = 0;
 var comentalbum = 0;
 var curtidasalbum= 0;
 var carrinho = [];
 var auxpessoal = [];
 var infoPessoais = [];
 var infoCredito = [];
 var carrinhoFinal = {carrinho, infoPessoais, infoCredito};
 var totalprod;
 var fotoCon = "img/miniatura.jpg";
 var nomeCon = 'João Victor Bellini';
 var fotoNoiva = "img/fundo.jpg";
 var nomeNoiva = 'Marjorie Rafaela Alvarenga Pereira';
 var album = ["img/miniatura.jpg", "img/miniatura.jpg", "img/miniatura.jpg"];
 var dataEvento = '4/12/2020';
 var rua = 'Maria Abadia A. Malagutti';
 var numero = '240';
 var bairro = 'Vila Formosa';
 var cidade = 'São Sebastião do Paraíso';
 var estadoE = 'MG';
 var msgBvindas = 'É com muito prazer que no dia 04 de Dezembro eu irei realizar meu primeiro' +
  'Chá de Lingerie, conto com a presença e a contribuição de todos vocês hein!!!';
 var localidade;
 var estado;
 var meta = 500;
 var vlrMeta = 200;
 
window.onload = function(){
  
  var init = {
    versao: function() {
      

      /* Pega Versão */
      if(myApp["data"]["teste"]){
        myApp["data"]["versao"] = "data";
        //myApp["data"]["banco"] = "http://localhost:8080/NuclickServer"
        //myApp["data"]["banco"] = "https://sistemaagely.com.br:8345/ChaDeLingerie280420/";
        myApp["data"]["banco"] = "https://sistemaagely.com.br:8345/ChaDeLingerie27082020/"
        typeof cordova !== "undefined" ? init.app() : init.web();
      } else { 
        jQuery.ajax({
          type: "POST",
          dataType: "json",
          url: myApp["data"]["url_raiz"] + "?tela=GetVersaoApp&app=chadelingerie&teste=" + myApp["data"]["teste"] + "&linkCompleto=true",
          success: function (data) { 
            myApp["data"]["versao"] = data;
            myApp["data"]["banco"] = data;
            localStorage[myApp["id"]] = JSON.stringify(myApp["data"]);
            typeof cordova !== "undefined" ? init.app() : init.web();
          },
          error: function (erro) { 
            myApp.toast.create({
              text: "Modo offline ativado",
              closeTimeout: 5000,
              closeButton: false,
              closeButtonColor: 'green',
            }).open();
          }
        });
      }
    },
    app: function(){
      init.boas_vindas();        
      document.addEventListener("backbutton", function(){ BackPage(); });
      window.open = cordova.InAppBrowser.open;
      $("#versao").text(BuildInfo["version"]);
      
    },
    web: function(){
      init.boas_vindas();
      $("#versao").text(myApp["data"]["versao"]);
    },
    boas_vindas: function(){
      LoadPage("home", { animate: false })
      carregaNoiva()
      carregaConvidado()
      carregaEvento()

      console.log(myApp.data.banco)

      salvaLocalStorage();
    },
    
    
  }

  if(typeof cordova !== "undefined")
    document.addEventListener('deviceready', function () { init.versao() }, false);
  else
    init.versao();

    

};





