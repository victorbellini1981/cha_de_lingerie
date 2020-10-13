/*-------------------------------------------------------------------------------------------------------------------*/
/*                                            Principal                                                              */
/*-------------------------------------------------------------------------------------------------------------------*/
  function Promessa(tela, parametros, load) { // Faz a comunicação com o servidor
    if (!navigator.onLine){
      Toast("Você está sem internet, verifique a conexão e tente novamente");
      myApp.preloader.show();
    }

    if(load == undefined)
     myApp.preloader.show();    if (!parametros)
      parametros = {};

    // parametros["idpessoa"] = jQuery.isEmptyObject(Usuario_Dados.listar()) ? 0: Usuario_Dados.listar()["pessoa"]["idpessoa"];

    return Promise.resolve(
      jQuery.ajax({
        type: "POST",
        dataType: "json",
        data: parametros,
        url: myApp["data"]["banco"] + "chadelingerie?metodo=" + tela
      })
    ).finally(function() {
      //LoadNuclick.close();
      myApp.preloader.hide();
    });
   }
  function GeraFormulario() {
    this.text = function (form, data){
      data["readonly"] = data["readonly"] ? "readonly" : "";
      data["required"] = data["required"] ? "required" : "";
      form.append("<li class='item-content item-input'>"
        + "<div class='item-inner'>"
        + "<div class='item-title item-label'>"+ data["title"] +"</div>"
        + "<div class='item-input-wrap'>"
        + "<input type='"+ data["type"] +"' placeholder='"+ data["title"] +"' name='"+ data["name"] +"' "+ data["readonly"] +" "+ data["required"]+">"
        + "</div>"
        + "</div>"
        + "</li>");
     }
    this.hidden = function (form, data){
      form.prepend("<input type='"+ data["type"] +"' placeholder='"+ data["title"] +"' name='"+ data["name"] +"'>");
     }
    this.textarea = function (form, data){
      data["readonly"] = data["readonly"] ? "readonly" : "";
      data["required"] = data["required"] ? "required" : "";
      form.append("<li class='item-content item-input'>"
      + "<div class='item-inner'>"
      + "<div class='item-title item-label'>"+ data["title"] +"</div>"
      + "<div class='item-input-wrap'>"
      + "<textarea class='resizable' placeholder='"+ data["title"] +"' name='"+ data["name"] +"' "+ data["readonly"] +" "+ data["required"]+"></textarea>"
      + "</div>"
      + "</div>"
      + "</li>");
     }
    this.select = function (form, data){
      data["readonly"] = data["readonly"] ? "readonly" : "";

      for (var key in data["valores"]) {
        var option = data["valores"][key];
        data["option"] += "<option value='"+ option["id"] +"'>"+ option["descricao"] +"</option>"
      }

      form.append( "<li class='item-content item-input'>"
      + "<div class='item-inner'>"
      + "<div class='item-title item-label'>"+ data["title"] +"</div>"
      + "<div class='item-input-wrap input-dropdown-wrap'>"
      + "<select placeholder='"+ data["title"] +"' name='"+ data["name"] +"' "+ data["readonly"] +">"
      + data["option"]
      + "</select>"
      + "</div>"
      + "</div>"
      + "</li>");
     }
    this.checkbox = function (form, data){
      form.append("<li class='item-content'>"
      + "<div class='item-inner item-input-wrap'>"
      + "<div class='item-title'>"+ data["title"] +"</div>"
      + "<div class='item-after'>"
      + "<label class='toggle toggle-init'>"
      + "<input type='checkbox' name='"+ data["name"] +"' checked=''>"
      + "<span class='toggle-icon'></span>"
      + "</label>"
      + "</div>"
      + "</div>"
      + "</li>");
     }
    this.autoComplete = function (form, data){
      data["required"] = data["required"] ? "required" : "";
      form.append("<li class='item-content item-input'>"
      + "<div class='item-inner'>"
      + "<div class='item-title item-label'>"+ data["title"] +"</div>"
      + "<div class='item-input-wrap'>"
      + "<input type='text' placeholder='"+ data["title"] +"' name='"+ data["name"] +"' id='"+ data["name"].replace(".", "-") +"' "+ data["required"] +">"
      + "</div>"
      + "</div>"
      + "</li>");

      AutoComplete(data);
     }

    this.getFormulario = function (form, data){
      for (var key in data) {
        var campo = data[key];

        if(campo["objeto"] != undefined)
          campo["name"] = campo["objeto"] + "." + campo["name"];
        
        if(["text", "number", "password", "email", "date"].indexOf(campo["type"]) >= 0){
          this.text(form, campo);
        } else if(campo["type"] == "hidden"){
          this.hidden(form, campo);
        } else if(campo["type"] == "textarea"){
          this.textarea(form, campo);
        } else if(campo["type"] == "select"){
          this.select(form, campo);
        } else if(campo["type"] == "checkbox"){
          this.checkbox(form, campo);
        } else if(campo["type"] == "AutoComplete"){
          this.autoComplete(form, campo);
        }

      }
     }
   }
  function Formulario() { 
    this.getValores = function(form) {//pega os valores digitados
      var data = {};
      form.find("[name]").each(function(index) {
        var campo = $(this).attr("placeholder");
        var required = $(this).attr("required");
        var name = $(this).attr("name");
        var type = $(this).attr("type");
        var value = $(this).val();
        var objeto = name.split('.');

        if (!value && required) {
          data = {};
          Toast("Campo " + campo + " é Obrigatório");
          $(this).focus();
          return false;
        }

        if(type == "checkbox"){
          value = $(this).is(":checked");
          
        }
        if (type == "email" && required) {
          var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
          if (!$.trim(value).match(pattern)) {
            data = {};
            Toast(campo + ' Inválido');
            $(this).focus().select();
            return false;
          }
        }

        if (type == "textarea" && !value) 
          value = value.replace(/\n/g, ' ').trim();        

        if (type == "password" && required && value) 
          /* value = md5("*" + value + "coocamm"); */

      /*   if(campo == "Usuário" && required){
          var pattern = /^(?=.{3,30}$)[a-zA-Z][a-zA-Z\d]*(-?|_?|\.?)[A-Za-z\d]+$/;
          if (!$.trim(value).match(pattern)) {
            data = {};
            Toast(campo + ' Inválido');
            $(this).focus().select();
            return false;
          }
        } */

        if((name == "cpf_cnpj" || objeto[1] === "cpf_cnpj") && required){
          if(!valida_cpf_cnpj(value)){
            data = {};
            Toast(campo + " Inválido");
            $(this).focus();
            return false;
          }
        }

        /* Verifica se é um Objeto */
        if (objeto.length == 2) {
          if (data[objeto[0]] == undefined) data[objeto[0]] = {};
          if (value) data[objeto[0]][objeto[1]] = value;
        } else {
          if (value) data[name] = value;
        }

      });
      return data;
     };
    this.setValores = function(form, data, objeto) {
      objeto = objeto == undefined ? "": objeto + ".";
      for (var key in data) {
        if(data[key] !="null" &&  data[key] != null){
          form.find("[name='"+ objeto + key +"']").val(data[key]).trigger("change");
          myApp.input.checkEmptyState(form.find("[name='"+ objeto + key +"']"));
        }
      }
     };
    this.clean = function(form) {
      form[0].reset();
      myApp.input.checkEmptyState(form.find("[name]"));
     };
   }
  function GeraGrafico() {
    this.lineGrafico = function (idGrafico, data, moeda, width) {
      $("#" + idGrafico).parent().empty().html("<canvas id='" + idGrafico + "'></canvas>");

      var grafico = document.getElementById(idGrafico).getContext('2d');
      var chart = new Chart(grafico, {
        // Tipo do grafico
        type: data["type"],

        // Dados do grafico
        data: data,
        // data: {
        //   labels: labels,
        //   datasets: [{
        //     label: title,
        //     backgroundColor: color,
        //     borderColor: color,
        //     data: dados,
        //     fill: false
        //   }]
        // },

        // Configuration options go here
        options: {
          responsive: true,
          legend: {
            display: data["legend"],
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            custom: function (tooltipModel) {
              tooltipModel.width = width;
              function getBody(bodyItem) {
                return bodyItem.lines;
              }
              // Set Text
              if (tooltipModel.body) {
                var titleLines = tooltipModel.title || [];
                var bodyLines = tooltipModel.body.map(getBody);
                bodyLines.forEach(function (body, i) {
                  var res = body[0].split(":");
                  // console.log(res[1]);
                  var valor = moeda + Util.formataDuasCasas(parseFloat(res[1]),4);
                  
                  body[0] = valor;
                });
              }
            },
          },
        }
      });
     }
   }
  function Util(){
    this.formataDuasCasas = function (n, casasDecimais) {
      var numero = parseFloat(n);
      casasDecimais = casasDecimais == undefined ? 2 : casasDecimais;
      numero = numero.toFixed(casasDecimais).split('.');
      numero[0] = " " + numero[0].split(/(?=(?:...)*$)/).join('.');
      return numero.join(',');
     }
    this.removeAccents = function (str) {
      var accents    = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      str = str.split('');
      var strLen = str.length;
      var i, x;
      for (i = 0; i < strLen; i++) {
        if ((x = accents.indexOf(str[i])) != -1) {
          str[i] = accentsOut[x];
        }
      }
      return str.join('');
     }
    this.copiaAreaTransferencia = function (text) {
      var textArea = document.createElement("textarea");
    
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = 0;
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.value = text;
    
      document.body.appendChild(textArea);
      textArea.select();
    
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        Toast('Copiado para area de transferência.');
      } catch (err) {
        Toast('Não foi possivel copiar para area de transferência');
      }
    
      document.body.removeChild(textArea);
     }
   /* this.maiuscula = function (text) {
			var loweredText = text.toLowerCase();
			var words = loweredText.split(" ");
			for (var a = 0; a < words.length; a++) {
				var w = words[a];

				var firstLetter = w[0];
				w = firstLetter.toUpperCase() + w.slice(1);

				words[a] = w;
			}
			return words.join(" ");
     };*/
    this.normaliza = function(data){
      return JSON.stringify(data).replace(/\"/g, "\'");
     }
    this.preloadImgUnica = function(url, el){ // Melhorar essa coisa linda
      url = "http://sistemaagely.com.br/"+ url.replace("getImagem", "getArquivo");
      
      preloadImage(url,
        function(){ // Imagem carregada com sucesso 
          $(el).stop().animate({opacity:'0'},function(){
          $(this).attr('src', url).animate({opacity:'1'});
          });
        },
        function(){ // Imagem não carregada
          $(el).stop().animate({opacity:'0'},function(){
          $(this).attr('src', 'img/sem_logo.png').animate({opacity:'1'});
          });
        }
      );

      function preloadImage(url, anImageLoadedCallback, anImageErrorCallback){
      var img = new Image();

      img.onload = function() {
          anImageLoadedCallback();
      };
      img.onerror = function() {
          anImageErrorCallback();
      };

      img.src = url;
      }
     }
    this.onlyNumber = function(data){
      return data != undefined ? data.replace(/[^\d]/,'') : undefined;
     }
    this.carregaGoogleMaps = function(data){
      return new google.maps.Map(document.getElementById(data["id"]), {
        center: { 
          lat: parseFloat(data["latitude"]),
          lng: parseFloat(data["longitude"])
        },
        zoom: 14,
        disableDefaultUI: true
      });
     }
    this.carregaMarkerGoogleMaps = function(data, map){
      return new google.maps.Marker({
        map: map,
        title: data["nome"],
				position: {
          lat: parseFloat(data["latitude"]),
          lng: parseFloat(data["longitude"])
        },
        icon: {
          url: "img/logo.png", // url
          scaledSize: new google.maps.Size(32, 32), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0,32) // anchor
        }
			});
     }
    this.ordenaArray = function(data, key){
      return data.sort(function (a, b) { return (Util.removeAccents(a[key]) > Util.removeAccents(b[key])) ? 1 : ((Util.removeAccents(b[key]) > Util.removeAccents(a[key])) ? -1 : 0); });
     }
    this.desordenaArray = function(data){
      return data.sort(function () { return .5 - Math.random(); });
     }
   }
  function Toast(texto, tempo, fechar) {
    tempo = tempo == undefined ? 3000 : tempo;
    fechar = fechar == undefined ? false : true;
    return myApp.toast.create({
      text: texto,
      closeTimeout: tempo,
      closeButton: fechar,
      closeButtonColor: 'green',
    }).open();
   }
  function LoadPage(name, parametros) {
    var pageName = "/" + name + "/";
    var page = $("#" + name);
    var painel = $(".panel-left");

    if(page.width() >= 1200)
      page.find(".tabs-swipeable-wrap").removeClass("tabs-swipeable-wrap").addClass("tabs-animated-wrap");

    if(painel.is(":visible")){
      if(painel.find(".accordion-item-opened").length > 0)
        myApp.accordion.close(painel.find(".accordion-item-opened"));

      myApp.panel.close();
    }

      View_Principal.router.navigate(pageName, parametros);
    
    openAccordion(page);
   }
  function BackPage(){
    var view;

    if (View_Principal.$el.hasClass("tab-active"))
      view = View_Principal;    

    if (View_Inicial.$el.hasClass("tab-active"))
      view = View_Inicial;

    if (myApp.popup.get() != undefined)
      myApp.popup.close();
    else if (myApp.dialog.get() != undefined) 
      myApp.dialog.close();
    else if ($(".iziModal").is(":visible")) 
      $(".iziModal:visible").iziModal("close");
 
    else 
      view.router.back();
  
    if (typeof cordova !== 'undefined') { screen.orientation.unlock(); }
   
   }
  function geraVirtualList(data) {
    return myApp.virtualList.create({
      // Elemento
      el: data["el"],
      // Array itens
      items: data["items"],
      // Função de busca
      searchAll: data["searchAll"],
      // Template lista
      itemTemplate: data["itemTemplate"],
      // Tamanho item
      height: data["height"]
    });
   }
  function geraListIndex(data){
    return myApp.listIndex.create({
      el: data["el"],
      listEl: data["listEl"],
      indexes: 'auto',
      scrollList: true,
      label: true,
    });
   }
  function abreviaName(name) { 
    var name = name.split(' ');
    var novoNome;
    for (var key in name) {
      if (key == 0) {
        novoNome = name[key] + ' ';
      } else if (key == name.length - 1) {
        novoNome += ' ' + name[name.length - 1];
      } else {
        novoNome += name[key].charAt(0).toUpperCase() + '.';
      }
    }
    return novoNome.trim();
   }
  function openAccordion(page){
    if(page.find(".list.accordion-list").length > 0){
      page.find(".list.accordion-list").each(function(index){
        myApp.accordion.open($(this).find(".accordion-item").eq(0));
      });
    }
   }
  function salvaLocalStorage(){
    localStorage[myApp["id"]] = JSON.stringify(myApp["data"]);
   }

//função para somar uma curtida ao álbum  
  function onClickcurtiralbum() {
            curtidasalbum += 1;
            document.getElementById("curtidasalbum").innerHTML = curtidasalbum;
            var display = document.getElementById("curtiralbum1").style.display;
            if (display == 'none') {
              document.getElementById("curtiralbum1").style.display = 'block';
              document.getElementById("curtiralbum").style.display = 'none'
            }
  };
//função para somar um comentário ao álbum  e adicionar comentario na lista de comentários
// no banco        
  function onClickrecadoalbum() {
            comentalbum += 1;
            document.getElementById("comentarioalbum").innerHTML = comentalbum;
          var recado = document.getElementById("recadoalbum").value;
          if (recado == "") {
          Toast("Faça um comentário!")
          } else {
            document.getElementById("recadoalbum").value = "";
            var lista = $("#listrecados ul");
            var listaA = $("#listrecados1 ul");
            
              lista.append('<li>'
            +'    <div class="item-content">'
            +'      <div class="item-media" id="fotoconvidrecados"><img src=' + fotoCon + ' width="44" /></div>'
            +'      <div class="item-inner">'
            +'        <div class="item-title-row">'
            +'          <div class="item-title" id="nomeconvidrecados">' + nomeCon + '</div>'
            +'        </div>'
            +'        <div class="item-text" id="txtconvidrecados">' + recado + '</div>'
            +'      </div>'
            +'    </div>'
            +'  </li>');
              listaA.append('<li>'
              +'    <div class="item-content">'
              +'      <div class="item-media" id="fotoconvidrecados"><img src=' + foto + ' width="44" /></div>'
              +'      <div class="item-inner">'
              +'        <div class="item-title-row">'
              +'          <div class="item-title" id="nomeconvidrecados">' + nome + '</div>'
              +'        </div>'
              +'        <div class="item-text" id="txtconvidrecados">' + recado + '</div>'
              +'      </div>'
              +'    </div>'
              +'  </li>')};
  };
// função para confirmar presença e adicionar foto do convidado na lista de convidados confirmados
  function onClickconfirmar() {
          confirmados += 1;
          document.getElementById("confirmados").innerHTML = ("CONFIRMADOS" + " " + "(" + confirmados + ")");

          var lista = $("#ecran");
          var listaA = $("#ecran1");

            lista.append(
          '  <img src=' + fotoCon + ' class="miniatura" />'    
            );
            listaA.append(
          '  <img src=' + fotoCon + ' class="miniatura" />' 
            );
  };
// função que rola automaticamente os comentarios e os confirmados para que o ultimo sempre apareça
  function ScrollDiv(){

          if(document.getElementById('ecran').scrollLeft<(document.getElementById('ecran').scrollWidth-document.getElementById('ecran').offsetWidth)){-1
                document.getElementById('ecran').scrollLeft=document.getElementById('ecran').scrollLeft+1
                }

                  if(document.getElementById('listrecados').scrollTop<(document.getElementById('listrecados').scrollHeight-document.getElementById('listrecados').offsetHeight)){-1
                    document.getElementById('listrecados').scrollTop=document.getElementById('listrecados').scrollTop+1
                    }
  }
  setInterval(ScrollDiv,0)
// função que retorna a lista de todos os convidados que confirmaram presença 
// e não só os últimos confirmados
  function onClickConfirmados() {
            var display = document.getElementById("ecran1").style.display;
            if (display == 'none') {
              document.getElementById("ecran1").style.display = 'block';
              document.getElementById("ecran").style.display = 'none'
            } else {
              document.getElementById("ecran1").style.display = 'none';
              document.getElementById("ecran").style.display = 'block'
            }
            
  };
// função que retorna a lista de todos os recados e não só os últimos.
function onClickrecados() {
            var display = document.getElementById("listrecados1").style.display;
            if (display == 'none') {
              document.getElementById("listrecados1").style.display = 'block';
              document.getElementById("listrecados").style.display = 'none'
            } else {
              document.getElementById("listrecados1").style.display = 'none';
              document.getElementById("listrecados").style.display = 'block'
            }
};
// função para abrir o filtro pro convidado filtar suas buscas
function AbreFiltro() {
            var display = document.getElementById("filtro").style.display;
            if (display == 'none') {
              document.getElementById("filtro").style.display = 'block';
            }
            else {
              document.getElementById("filtro").style.display = 'none';
            }
            $("#rangemin").html("0")
            $("#rangemax").html("1000")
            $("#min").val(0)
            $("#max").val(1000)
};
// função para abrir o carrinho de compras
function AbreCarrinho() {
            var display = document.getElementById("carrinho").style.display;
            if (display == 'none') {
              document.getElementById("carrinho").style.display = 'block';
            }
            else {
              document.getElementById("carrinho").style.display = 'none';
            }
};

function addSeparator(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + '.' + '$2');
            }
            return x1 + x2;
};
//função para escolher o minimo e o máximo do valor dos produto que deseja comprar
  function MinMax(){
          $("#objprecosmin").val(0)
          $("#objprecosmax").val(1000)
          $("#rangemin").html("0")
          $("#rangemax").html("1000")
          $("#min").val(0)
          $("#max").val(1000)
          
          
  };
// função que faz retornar o mínimo pro 0 e o máximo pra 1000
  function rangeInputChangeEventHandler(e){
          var rangeGroup = $(this).attr('name'),
              minBtn = $(this).parent().children('.min'),
              maxBtn = $(this).parent().children('.max'),
              range_min = $(this).parent().children('.range_min'),
              range_max = $(this).parent().children('.range_max'),
              minVal = parseInt($(minBtn).val()),
              maxVal = parseInt($(maxBtn).val()),
              origin = $(this).context;
              

          if(origin === 'min' && minVal > maxVal-5){
              $(minBtn).val(maxVal-5);
          }
          var minVal = parseInt($(minBtn).val());
          $(range_min).html(addSeparator(minVal*1));


          if(origin === 'max' && maxVal-5 < minVal){
              $(maxBtn).val(5+ minVal);
          }
          var maxVal = parseInt($(maxBtn).val());
          $(range_max).html(addSeparator(maxVal*1));
          $("#objprecosmin").val(minVal)
          $("#objprecosmax").val(maxVal)
          
  };
// carrega a lista com os produtos que estão na faixa de preço selecionada
  function Aplicar(){
          var minimo = parseInt($("#objprecosmin").val());
          var maximo = parseInt($("#objprecosmax").val());
          var precos = JSON.parse($("#objmenor").val().replace(/\'/g, '\"'));
          var lista = $("#listlingeries ul");
          lista.empty();//limpa a lista
          for (var i in precos){
            var a = parseInt(i);
            for (var j = a+1; j < precos.length; j++){
              if(precos[j]["preco_tabela"] < precos[i]["preco_tabela"]){
                var aux= precos[i];
                precos[i] = precos[j];
                precos[j] = aux;
              }
            }
          }
          for (var i in precos){
            var imagem;
            var arraylink = precos[i].link.replace("{", "")
            arraylink = arraylink.replace("}", "")
            arraylink = arraylink.split(",")
            if(precos[i]["link"] == '{NULL}'){
              imagem = '<img class="minlingerie" src="img/sem_foto.png" alt="" onclick="Listas.detalhaProduto('+ precos[i]["referencia"]+')">'
              }else{
                imagem = '<img class="minlingerie" src="https://sistemaagely.com.br:8345/'+ arraylink[0]+'" alt="" onclick="Listas.detalhaProduto('+ precos[i]["referencia"]+')">'
              }
            if(precos[i]["preco_tabela"] >= minimo && precos[i]["preco_tabela"] <= maximo){
              lista.append('<li class="col-50">'
                +'  <div class="container">'
                +'    <div class="item-content">'
                +'        <div class="minlingeries" style="text-align: center;">'
                +                 imagem  
                // +'            <img class="minlingerie" src="https://sistemaagely.com.br:8345/'+ data[i]["link"]+'" alt="" onclick="Listas.detalhaProduto('+ data[i]["referencia"]+')"><br />'
                +'            <div class="row" id="nomelingerie">'
                +'                <h6>'+ precos[i]["descricao"]+'</h6>'
                +'            </div>'
                // +'            <div class="row" id="cotas">'
                // +'                <h6 style="color: rgb(170, 166, 166);">10 cotas de:</h6>'
                // +'            </div>'
                +'            <div class="row" id="preco">'
                +'                <h6 class="valor" id="valor">R$'+ " " +Util.formataDuasCasas((precos[i]["preco_tabela"])) +'</h6>'
                +'            </div>'
                +'            <div class="btnpresentear"><button class="col button button-fill button-round color-red" id="botao"'
                +'                    style="text-align: center; " onclick="Listas.detalhaProduto('+ precos[i]["referencia"]+')">'
                +'                    <h6 style="color: white;">Presentear</h6>'
                +'                </button></div>'
                +'        </div>'
                +'    </div>'
                +'  </div>'
                +'</li>');
            }
          }
          $("#objprecosmin").val(0)
          $("#objprecosmax").val(1000)
          AbreFiltro()
  }
        
  $('input[type="range"]').on( 'input', rangeInputChangeEventHandler);

  /*function contanotificacao(){
          notificacao += 1;
          $("#btnnotif .descricao" ).html(notificacao)
          setTimeout(function() {
            contanotificacao()
          }, 30000);
  }*/

  function listaEstados(data){
    var lista = $("#ufs ");
    var listab = $("#cidades");
    lista.empty();//limpa a lista
    listab.empty();
    lista.append('<option value="0"></option>')
    listab.append('<option value="0"></option>')
    for (var i in data) {
      lista.append('<option value="'+ i +'">'+ i +'</option>');
      for (var j in data[i]){
        listab.append('<option value="'+ data[i][j]["cidade"] +'">'+ data[i][j]["cidade"] +'</option>');   
      }
    }
    LoadPage('minhasinformacoes');
  }

  function listaCidades(data){
    var uf = $("#ufs").val()
    var listab = $("#cidades"); 
    listab.empty();
    listab.append('<option value="0"></option>') 
    for (var i in data){
      for (var j in data[i]){
        if (data[i][j]["estado"] == uf) {
          listab.append('<option value="'+ data[i][j]["cidade"] +'">'+ data[i][j]["cidade"] +'</option>')  
        }
      }
    }
    document.getElementById('cidades').value=(Util.removeAccents(localidade));
    var cidade = {
      cidade: localidade,
      estado: uf
    }
    Listas.idCidade(cidade)
  }

  //lista produtos de acordo com a chamada GetProdutos
  function listaProdutos(data){
    $("#objmenor").val(JSON.stringify(data).replace(/\"/g, "\'"))
    var lista = $("#listlingeries ul");
    lista.empty();//limpa a lista
    for (var i in data) {
    var imagem;
    var arraylink = data[i].link.replace("{", "")
    arraylink = arraylink.replace("}", "")
    arraylink = arraylink.split(",")
      if(data [i]["link"] == '{NULL}'){
        imagem = '<img class="minlingerie" src="img/sem_foto.png" alt="" onclick="Listas.detalhaProduto('+ data[i]["referencia"]+')">'
        }else{
          imagem = '<img class="minlingerie" src="https://sistemaagely.com.br:8345/'+ arraylink[0]+'" alt="" onclick="Listas.detalhaProduto('+ data[i]["referencia"]+')">'
        }
      lista.append('<li class="col-50">'
      +'  <div class="container">'
      +'    <div class="item-content">'
      +'        <div class="minlingeries" style="text-align: center;">'
      +                 imagem  
      // +'            <img class="minlingerie" src="https://sistemaagely.com.br:8345/'+ data[i]["link"]+'" alt="" onclick="Listas.detalhaProduto('+ data[i]["referencia"]+')"><br />'
      +'            <div class="row" id="nomelingerie" style="text-align: center;">'
      +'                <h6>'+ data[i]["descricao"]+'</h6>'
      +'            </div>'
    // +'            <div class="row" id="cotas">'
    // +'                <h6 style="color: rgb(170, 166, 166);">10 cotas de:</h6>'
    // +'            </div>'
      +'            <div class="row" id="preco" style="text-align: center;">'
      +'                <h6 class="valor" id="valor">R$'+ " " +Util.formataDuasCasas((data[i]["preco_tabela"])) +'</h6>'
      +'            </div>'
      +'            <div class="btnpresentear"><button class="col button button-fill button-round color-red" id="botao"'
      +'                    style="text-align: center; " onclick="Listas.detalhaProduto('+ data[i]["referencia"]+')">'
      +'                    <h6 style="color: white;">Presentear</h6>'
      +'                </button></div>'
      +'        </div>'
      +'    </div>'
      +'  </div>'
      +'</li>');
    }
    LoadPage('listapresentes')
  }

  function detalhaProduto(data) {
    $("#nomelingerie").html("<h6>" + data.descricao + " - " + data.cor + "</h6>")
    $("#ref").html(data.referencia)
    $("#marca").html(data.marca)
    totalprod = data.preco_tabela
    $("#tamanhos").empty()
    var arraytam = data.tamanhos.replace("{", "")
    arraytam = arraytam.replace("}", "")
    arraytam = arraytam.split(",")
    var arraycomptam = [];
    arraycomptam.push(arraytam[0]);
    var comp;
    for (var k in arraytam) {
      comp = false;
      for (var j in arraycomptam) {
        if (arraytam[k] == arraycomptam[j]) {
          comp = true;
          break;
        }
      }
      if (comp == false) {
        arraycomptam.push(arraytam[k]);
      }
    }
    for (var i in arraycomptam) {
      if (arraycomptam[i] == 'PP') {
        arraycomptam[i] = 1;
      }
      else if (arraycomptam[i] == 'P') {
        arraycomptam[i] = 2;
      }
      else if (arraycomptam[i] == 'M') {
        arraycomptam[i] = 3;
      }
      else if (arraycomptam[i] == 'G') {
        arraycomptam[i] = 4;
      }
      else if (arraycomptam[i] == 'GG') {
        arraycomptam[i] = 5;
      }
      else if (arraycomptam[i] == 'EG') {
        arraycomptam[i] = 6;
      }
      else if (arraycomptam[i] == 'XG') {
        arraycomptam[i] = 7;
      }
      else if (arraycomptam[i] == 'XXG') {
        arraycomptam[i] = 8;
      }
    }
    arraycomptam.sort();
    for (var i in arraycomptam) {
      if (arraycomptam[i] == 1) {
        arraycomptam[i] = 'PP';
      }
      else if (arraycomptam[i] == 2) {
        arraycomptam[i] = 'P';
      }
      else if (arraycomptam[i] == 3) {
        arraycomptam[i] = 'M';
      }
      else if (arraycomptam[i] == 4) {
        arraycomptam[i] = 'G';
      }
      else if (arraycomptam[i] == 5) {
        arraycomptam[i] = 'GG';
      }
      else if (arraycomptam[i] == 6) {
        arraycomptam[i] = 'EG';
      }
      else if (arraycomptam[i] == 7) {
        arraycomptam[i] = 'XG';
      }
      else if (arraycomptam[i] == 8) {
        arraycomptam[i] = 'XXG';
      }
    }
    // adiciona os tamanhos disponiveis de cada produto
    for (var i in arraycomptam) {
      $("#tamanhos").append('<div class="col-25 tamanho" id="tamanho_' + arraycomptam[i] + '" onclick="seltamanho(this)">'
        + '    <h6> ' + arraycomptam[i] + ' </h6>'
        + '  </div>')
    }
    $("#qtde").empty()
    $("#qtde").append('<div class="stepper-button-minus" id="menos" style="border-color: black;" onclick="stepperMin()"></div>'
      +'<div class="stepper-input-wrap" id="value" style="border-color: black;">'
      +'  <input type="text" id="objqtd" value="1" min="1" max="10" readonly>'
      +'</div>'
      +'<div class="stepper-button-plus" id="mais" style="border-color: black;" onclick="stepperMax()"></div>');
    $("#objcarrinho").val(JSON.stringify(data).replace(/\"/g, "\'"))
    $("#listFotos .swiper-wrapper").empty()
    // verifica se existe foto disponivel, se não existir adiciona imagem(sem foto) no slider
    if (data.link == "{NULL}") {
      var fotos = '<img class="minlingerie" src="img/sem_foto.png" alt=""/>'
      $("#listFotos .swiper-wrapper").append(' <div class="swiper-slide">'
        + fotos
        + '  </div>')
      // se não, separa as fotos
    } else { 
      var arrayfotos = data.link.replace("{", "")
      arrayfotos = arrayfotos.replace("}", "")
      arrayfotos = arrayfotos.split(",")
      
      // adiciona fotos no slider
      for (var i in arrayfotos) {
        $("#listFotos .swiper-wrapper").append(' <div class="swiper-slide">'
          + '    <img src="https://sistemaagely.com.br:8345/' + arrayfotos[i] + '" />'
          + '  </div>')
      }
    }
    Swiper_Premium = myApp.swiper.create($('#listlingerie .swiper-container'), {

      pagination: {
        el: '.swiper-pagination'
      }
    });
    $("#valorGeral").empty()
    $("#valorGeral").append("R$" + Util.formataDuasCasas((totalprod)))
    LoadPage('presenteselect')
  }
// ordena a lista de produtos do menor pro maior preço
  function menorPreco(){
    var menorpreco = JSON.parse($("#objmenor").val().replace(/\'/g, '\"'));
    for (var i in menorpreco){
      var a = parseInt(i);
      for (var j = a+1; j < menorpreco.length; j++){
        if(menorpreco[j]["preco_tabela"] < menorpreco[i]["preco_tabela"]){
          var aux= menorpreco[i];
          menorpreco[i] = menorpreco[j];
          menorpreco[j] = aux;
        }
      }
    }
    var lista = $("#listlingeries ul");
    lista.empty();//limpa a lista
    for (var i in menorpreco) {
      var imagem;
      if(menorpreco [i]["link"] == undefined){
        imagem = '<img class="minlingerie" src="img/sem_foto.png" alt="" onclick="Listas.detalhaProduto('+ menorpreco[i]["referencia"]+')">'
        }else{
          imagem = '<img class="minlingerie" src="https://sistemaagely.com.br:8345/'+ menorpreco[i]["link"]+'" alt="" onclick="Listas.detalhaProduto('+ menorpreco[i]["referencia"]+')">'
        }
      lista.append('<li class="col-50">'
      +'  <div class="container">'
      +'    <div class="item-content">'
      +'        <div class="minlingeries" style="text-align: center;">'
      +                 imagem  
      // +'            <img class="minlingerie" src="https://sistemaagely.com.br:8345/'+ data[i]["link"]+'" alt="" onclick="Listas.detalhaProduto('+ data[i]["referencia"]+')"><br />'
      +'            <div class="row" id="nomelingerie">'
      +'                <h6>'+ menorpreco[i]["descricao"]+'</h6>'
      +'            </div>'
      // +'            <div class="row" id="cotas">'
      // +'                <h6 style="color: rgb(170, 166, 166);">10 cotas de:</h6>'
      // +'            </div>'
      +'            <div class="row" id="preco">'
      +'                <h6 class="valor" id="valor">R$'+ " " +Util.formataDuasCasas((menorpreco[i]["preco_tabela"])) +'</h6>'
      +'            </div>'
      +'            <div class="btnpresentear"><button class="col button button-fill button-round color-red" id="botao"'
      +'                    style="text-align: center; " onclick="Listas.detalhaProduto('+ menorpreco[i]["referencia"]+')">'
      +'                    <h6 style="color: white;">Presentear</h6>'
      +'                </button></div>'
      +'        </div>'
      +'    </div>'
      +'  </div>'
      +'</li>');
    }
  }
// tras o valor total do carrinho de compras
  function multiplicaValor(){
    var total = totalprod * parseInt($("#objqtd").val())
    $("#valorGeral").empty()
    $("#valorGeral").append("R$" + Util.formataDuasCasas((total)))
  }
// retorna lista de parcelas pro cliente escolher qtde de parcelas que vai pagar
  function valorCarrinho() {
    var valor = 0;
    var qtd = 0;
    for (var i in carrinho) {
      valor = valor + carrinho[i]["total"]
      qtd = qtd + parseInt(carrinho[i]["qtd"])
    }
    $("#valortotal").html("Total R$ " + Util.formataDuasCasas((valor)));
    $("#valortotal1").html("Total R$ " + Util.formataDuasCasas((valor)));
    $("#qtd").html(qtd);
    $("#qtd1").html(qtd);
    var lista = $("#parcelas");
        lista.empty();
        lista.append('<option value="0"></option>'
        +'  <option value="1">1x de '+ "R$" + " " + Util.formataDuasCasas(valor) +'</option>'
        +'  <option value="2">2x de '+ "R$" + " " + Util.formataDuasCasas(valor/2) +'</option>'
        +'  <option value="3">3x de '+ "R$" + " " + Util.formataDuasCasas(valor/3) +'</option>'
        +'  <option value="4">4x de '+ "R$" + " " + Util.formataDuasCasas(valor/4) +'</option>'
        +'  <option value="5">5x de '+ "R$" + " " + Util.formataDuasCasas(valor/5) +'</option>'
        +'  <option value="6">6x de '+ "R$" + " " + Util.formataDuasCasas(valor/6) +'</option>'
        +'  <option value="7">7x de '+ "R$" + " " + Util.formataDuasCasas(valor/7) +'</option>'
        +'  <option value="8">8x de '+ "R$" + " " + Util.formataDuasCasas(valor/8) +'</option>'
        +'  <option value="9">9x de '+ "R$" + " " + Util.formataDuasCasas(valor/9) +'</option>'
        +'  <option value="10">10x de '+ "R$" + " " + Util.formataDuasCasas(valor/10) +'</option>');
  }
// adiciona produto no carrinho
  function adicionaCarrinho() {
    var tamanho;
    var auxcarrinho;
    var vezes;
    var vlrtotal;
    // percorre os tamanhos pra saber se algum foi selecionado
    $.each($("#tamanhos .active"), function () {
      tamanho = $(this).find("h6").text()
    });
    // se não foi selecionado
    if (tamanho == undefined) {
      Toast("Favor selecionar o tamanho!")
    } else { // se foi selecionado carrinho pega dados da lingerie e tamanho selecionado
      auxcarrinho = JSON.parse($("#objcarrinho").val().replace(/\'/g, '\"'));
      vezes = $("#objqtd").val();
      vlrtotal = auxcarrinho.preco_tabela * vezes
      auxcarrinho.qtd = vezes
      auxcarrinho.total = vlrtotal
      auxcarrinho.tamanhos = tamanho
      carrinho.push(auxcarrinho)
      Toast("Produto adicionado ao carrinho")
      listaCarrinho()
      
    }
  }

  function listaCarrinho () {
    if (carrinho.length == 0) {
      Toast("Seu carrinho está vazio!!")
    } else{
    var lista = $("#carrinho ul");
    //var listaA = $("#carrinho1 ul")
    //listaA.empty();
    lista.empty();
      for (var i in carrinho) {
        var imagem;
        if(carrinho[i]["link"] == "{NULL}"){
          imagem = '<img class="minlingerie" src="img/sem_foto.png" alt=""/>'
          }else{
            var arrayfotos = carrinho[i]["link"].replace("{","")
            arrayfotos = arrayfotos.replace("}","")
            arrayfotos = arrayfotos.split(",")
            carrinho[i]["link"] = arrayfotos[0]
            imagem = '<img class="minlingerie" src="https://sistemaagely.com.br:8345/'+ carrinho[i]["link"]+'" alt=""/>'
          }
        lista.append('<li>'
        +'  <div class="item-content">'
        +'      <div class="item-media">'
        +         imagem
        +'      </div>'
        +'      <div class="item-inner">'
        +'      <div class="item-title-row">'
        +'      <div class="item-title" id="nomelingeriecar">'+ carrinho[i]["descricao"] +'</div>'
        +'        </div>'
        +'        <div class="item-subtitle">'
        +'          <div class="row">'
        +'            <div class="col-33">'+ carrinho[i]["cor"] +'</div>'
        +'            <div class="col-33">'
        +'              <h4>Tam: '+ " " + carrinho[i]["tamanhos"] +'</h4>'
        +'            </div>'
        +'            <div class="col-33">'
        +'            <h4>R$ '+ " " + Util.formataDuasCasas((carrinho[i]["preco_tabela"])) +'</h4>'
        +'            </div>'
        +'          </div>'
        +'          <div class="row">'
        +'            <div class="col-30">'
        +'              <h4>Qtd: '+ " " + carrinho[i]["qtd"] +'</h4>'
        +'            </div>'
        +'            <div class="col-70">'
        +'            <h4>Total R$ '+ " " + Util.formataDuasCasas((carrinho[i]["total"])) +'</h4>'
        +'            </div>'
        +'          </div>'
        +'          <div style="height: 5px;"></div>'
        +'          <div class="row" id="excluiprod">'
        +'            <a onclick="excluirProd('+ i +')">Excluir produto</a>'
        +'          </div>'
        +'        </div>'
        +'      </div>'
        +'    </div>'
        +'  </li>');
        /*listaA.append('<li>'
        +'    <div class="item-content">'
        +'      <div class="item-media">'
        +         imagem
        +'      </div>'
        +'      <div class="item-inner">'
        +'      <div class="item-title-row">'
        +'      <div class="item-title" id="nomelingeriecar">'+ carrinho[i]["descricao"] +'</div>'
        +'        </div>'
        +'        <div class="item-subtitle">'
        +'          <div class="row">'
        +'            <div class="col-33">'+ carrinho[i]["cor"] +'</div>'
        +'            <div class="col-33">'
        +'              <h4>Tam: '+ " " + carrinho[i]["tamanhos"] +'</h4>'
        +'            </div>'
        +'            <div class="col-33">'
        +'            <h4>R$ '+ " " + Util.formataDuasCasas((carrinho[i]["preco_tabela"])) +'</h4>'
        +'            </div>'
        +'          </div>'
        +'          <div class="row">'
        +'            <div class="col-30">'
        +'              <h4>Qtd: '+ " " + carrinho[i]["qtd"] +'</h4>'
        +'            </div>'
        +'            <div class="col-70">'
        +'            <h4>Total R$ '+ " " + Util.formataDuasCasas((carrinho[i]["total"])) +'</h4>'
        +'            </div>'
        +'          </div>'
        +'          <div style="height: 5px;"></div>'
        +'          <div class="row" id="excluiprod1">'
        +'            <a onclick="excluirProd('+ i +')">Excluir produto</a>'
        +'          </div>'
        +'        </div>'
        +'      </div>'
        +'    </div>'
        +'  </li>');*/
      }
      valorCarrinho();
      LoadPage('carrinhofinal')
    }
  }
  function continuar(){
    document.getElementById("carrinho1").style.display = 'none'
    document.getElementById("carrinho").style.display = 'none'
    LoadPage('listapresentes')
  }
  function limpaCarrinho() {
    carrinho = [];
    carrinhoFinal = {carrinho, infoPessoais, infoCredito};
    LoadPage("listapresentes")
  }
  function excluirProd(index){
    carrinho.splice(index,1)
    if (carrinho.length == 0){
      AbreCarrinho();
      LoadPage("listapresentes")
    } else {
      listaCarrinho();
    }
  }
  function stepperMax(){
    $("#objqtd").val(parseInt($("#objqtd").val()) + 1);  
    
    multiplicaValor()
  }
  function stepperMin(){
    $("#objqtd").val(parseInt($("#objqtd").val()) - 1);
      
    multiplicaValor()
  }

  function seltamanho(el) {
    $('#tamanhos').find('.tamanho').removeClass('active');
  
    $('#tamanhos').find(el).addClass("active");
  }
  
  function is_cpf (c) {

    if((c = c.replace(/[^\d]/g,"")).length != 11)
      return false

    if (c == "00000000000" ||
        c == "11111111111" ||
        c == "22222222222" ||
        c == "33333333333" ||
        c == "44444444444" ||
        c == "55555555555" ||
        c == "66666666666" ||
        c == "77777777777" ||
        c == "88888888888" ||
        c == "99999999999")
      return false;

    var r;
    var s = 0;

    for (i=1; i<=9; i++)
      s = s + parseInt(c[i-1]) * (11 - i);

    r = (s * 10) % 11;

    if ((r == 10) || (r == 11))
      r = 0;

    if (r != parseInt(c[9]))
      return false;

    s = 0;

    for (i = 1; i <= 10; i++)
      s = s + parseInt(c[i-1]) * (12 - i);

    r = (s * 10) % 11;

    if ((r == 10) || (r == 11))
      r = 0;

    if (r != parseInt(c[10]))
      return false;

    return true;
  }

  function fMasc(objeto,mascara) {
    obj=objeto
    masc=mascara
    setTimeout("fMascEx()",1)
  }

  function fMascEx() {
    obj.value=masc(obj.value)
  }

  function mCPF(cpf){
    cpf=cpf.replace(/\D/g,"")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
    return cpf
  }

  function MCPF(cpf){
    cpf=cpf.replace(/\D/g,"")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
    return cpf
  }

  cpfCheck = function (el) {
      document.getElementById('cpfResponse').innerHTML = is_cpf(el.value)? '<span style="color:green"> CPF válido</span>' : '<span style="color:red">CPF inválido</span>';
      if(el.value=='') document.getElementById('cpfResponse').innerHTML = '';
      document.getElementById('cpfResponseb').innerHTML = is_cpf(el.value)? '<span style="color:green"> CPF válido</span>' : '<span style="color:red">CPF inválido</span>';
      if(el.value=='') document.getElementById('cpfResponseb').innerHTML = '';
  }

  function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('logradouro').value=("");
    document.getElementById('bairro').value=("");
    document.getElementById('cidade').value=("");
    document.getElementById('estado').value=("");
  }

  function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
      //Atualiza os campos com os valores.
      document.getElementById('logradouro').value=(conteudo.logradouro);
      document.getElementById('bairros').value=(conteudo.bairro);
      document.getElementById('cidades').value=(conteudo.localidade);
      document.getElementById('ufs').value=(conteudo.uf);
      localidade = conteudo.localidade
      estado = conteudo.uf
      console.log(localidade)
      
      
    }//end if.
    else {
      //CEP não Encontrado.
      limpa_formulário_cep();
      Toast("CEP não encontrado.");
    }
    
  }

  function pesquisacep() {
    //Nova variável "cep" somente com dígitos.
    var cep = $("#cep").val();
    cep = cep.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)) {

          //Preenche os campos com "..." enquanto consulta webservice.
          document.getElementById('logradouro').value="...";
          document.getElementById('bairros').value="...";
          document.getElementById('cidades').value="...";
          document.getElementById('ufs').value="...";
          

          //Cria um elemento javascript.
          var script = document.createElement('script');

          //Sincroniza com o callback.
          script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

          //Insere script no documento e carrega o conteúdo.
          document.body.appendChild(script);

      } //end if.
      else {
          //cep é inválido.
          limpa_formulário_cep();
          alert("Formato de CEP inválido.");
      }
    } //end if.
    else {
      //cep sem valor, limpa formulário.
      limpa_formulário_cep();
    }
   Listas.listaCidades()  
  };
  function salvarPessoa(){
    
    Formulario = $("#formpessoais");
      if (Formulario[0][0]["value"] == "") {
        Toast("Digite seu nome")
      }
      else if (Formulario[0][1]["value"] == "") {
        Toast("Digite seu CPF")
      } else if (Formulario[0][1]["selectionStart"] < 14){
        Toast("Documento precisa ter 11 digitos")
      }
      else if (Formulario[0][2]["value"] == "") {
        Toast("Digite seu RG")
      }
      
      else if (Formulario[0][3]["value"] == "") {
        Toast("Digite seu e-mail")
      }
      else if (Formulario[0][4]["value"] == "") {
        Toast("Digite seu telefone")
      } else if (Formulario[0][4]["selectionStart"] < 15){
        Toast("Telefone precisa ter 11 digitos")
      }
      else if (Formulario[0][5]["value"] == "") {
        Toast("Digite sua mensagem")
      }
      else{
        auxpessoal.nome = Formulario[0][0]["value"];
        auxpessoal.cpf = Formulario[0][1]["value"];
        auxpessoal.rg = Formulario[0][2]["value"];
        
        auxpessoal.email = Formulario[0][3]["value"];
        auxpessoal.telefone = Formulario[0][4]["value"];
        auxpessoal.msg = Formulario[0][5]["value"];
        if(infoPessoais.length == 0){
          infoPessoais.push(auxpessoal);
          Formulario[0].reset();
        } else {
          infoPessoais[0]["nome"] = Formulario[0][0]["value"];
          infoPessoais[0]["cpf"] = Formulario[0][1]["value"];
          infoPessoais[0]["rg"] = Formulario[0][2]["value"];
          
          infoPessoais[0]["email"] = Formulario[0][3]["value"];
          infoPessoais[0]["telefone"] = Formulario[0][4]["value"];
          infoPessoais[0]["msg"] = Formulario[0][5]["value"];
          Toast("Dados alterados com sucesso!")
          Formulario[0].reset();
        }
        $(".restante").html("200")
        LoadPage('meuendereco')
      }
  }
  function salvarEndereco(){
    
    Formulario = $("#formendereco");
    if (Formulario[0][0]["value"] == "") {
      Toast("Digite seu cep")
    } else if (Formulario[0][0]["selectionStart"] < 9){
      Toast("Cep precisa ter 8 digitos")
    }
    else if (Formulario[0][1]["value"] == 0) {
      Toast("Selecione seu Estado")
    } 
    else if (Formulario[0][2]["value"] == 0) {
      Toast("Digite sua Cidade")
    }
    else if (Formulario[0][3]["value"] == "") {
      Toast("Digite seu logradouro")
    }
    else if (Formulario[0][4]["value"] == "") {
      Toast("Digite o número da casa")
    }
    else if (Formulario[0][6]["value"] == "") {
      Toast("Digite seu bairro")
    }
      else{
        auxpessoal.cep = Formulario[0][0]["value"];
        auxpessoal.estado = Formulario[0][1]["value"];
        auxpessoal.cidade = Formulario[0][2]["value"];
        auxpessoal.logradouro = Formulario[0][3]["value"];
        auxpessoal.numero = Formulario[0][4]["value"];
        auxpessoal.complemento = Formulario[0][5]["value"];
        auxpessoal.bairro = Formulario[0][6]["value"];
        if(infoPessoais.length == 0){
          infoPessoais.push(auxpessoal);
          Formulario[0].reset();
        } else {
          infoPessoais[0]["cep"] = Formulario[0][0]["value"];
          infoPessoais[0]["estado"] = Formulario[0][1]["value"];
          infoPessoais[0]["cidade"] = Formulario[0][2]["value"];
          infoPessoais[0]["logradouro"] = Formulario[0][3]["value"];
          infoPessoais[0]["numero"] = Formulario[0][4]["value"];
          infoPessoais[0]["complemento"] = Formulario[0][5]["value"];
          infoPessoais[0]["bairro"] = Formulario[0][6]["value"];
          Toast("Dados inseridos com sucesso!")
          Formulario[0].reset();
        }
        valorCarrinho()
        LoadPage('pagamento')
      }
  }
  function salvarCredito(){
    var auxcredito = []
    Formulario = $("#formcredito");
      if (Formulario[0][0]["value"] == "") {
        Toast("Digite o número do cartão")
      }else if (Formulario[0][0]["selectionStart"] < 19){
        Toast("Cartão precisa ter 16 digitos")
      }
      else if (Formulario[0][1]["value"] == "") {
        Toast("Digite o nome que está no cartão")
      } 
      else if (Formulario[0][2]["value"] == 0) {
        Toast("Escolha o tipo de documento")
      }
      else if (Formulario[0][3]["value"] == "") {
        Toast("Digite o número do documento")
      }else if (Formulario[0][3]["selectionStart"] < 14){
        Toast("Documento precisa ter 11 digitos")
      }
      else if (Formulario[0][4]["value"] == 0) {
        Toast("Escolha o mês de validade do cartão")
      }
      else if (Formulario[0][5]["value"] == 0) {
        Toast("Escolha o ano de validade do cartão")
      }
      else if (Formulario[0][6]["value"] == "") {
        Toast("Digite o código de segurança do cartão")
      }else if (Formulario[0][6]["selectionStart"] < 3){
        Toast("Código precisa ter 3 digitos")
      }
      else if (Formulario[0][7]["value"] == 0) {
        Toast("Escolha a quantidade de parcelas")
      }
      else{
        auxcredito.numcartao = Formulario[0][0]["value"];
        auxcredito.nomecartao = Formulario[0][1]["value"];
        auxcredito.tipodoc = Formulario[0][2]["value"];
        auxcredito.numdoc = Formulario[0][3]["value"];
        auxcredito.mes = Formulario[0][4]["value"];
        auxcredito.ano = Formulario[0][5]["value"];
        auxcredito.codseg = Formulario[0][6]["value"];
        auxcredito.parcelas = Formulario[0][7]["value"];
        if(infoCredito.length == 0){
          infoCredito.push(auxcredito);
          Formulario[0].reset();
        } else {
          infoCredito[0]["numcartao"] = Formulario[0][0]["value"];
          infoCredito[0]["nomecartao"] = Formulario[0][1]["value"];
          infoCredito[0]["tipodoc"] = Formulario[0][2]["value"];
          infoCredito[0]["numdoc"] = Formulario[0][3]["value"];
          infoCredito[0]["mes"] = Formulario[0][4]["value"];
          infoCredito[0]["ano"] = Formulario[0][5]["value"];
          infoCredito[0]["codseg"] = Formulario[0][6]["value"];
          infoCredito[0]["parcelas"] = Formulario[0][7]["value"];
          Toast("Dados alterados com sucesso!")
          Formulario[0].reset();
        }
        confirmacao()
      }
  }
  function confirmacao(){
    $("#nomecartaopg").html(carrinhoFinal.infoCredito[0]["nomecartao"]);
    $("#tipodocpg").html(carrinhoFinal.infoCredito[0]["tipodoc"] + ":");
    $("#numdocpg").html(carrinhoFinal.infoCredito[0]["numdoc"]);
    $("#numcartaopg").html(carrinhoFinal.infoCredito[0]["numcartao"]);
    $("#valcartaopg").html(carrinhoFinal.infoCredito[0]["mes"] + "/" + carrinhoFinal.infoCredito[0]["ano"]);
    $("#codsegpg").html(carrinhoFinal.infoCredito[0]["codseg"]);
    var valor = 0;
    for (var itens in carrinho) {
      valor = valor + carrinho[itens]["total"]
    }
    $("#totalpg").html("R$ " + Util.formataDuasCasas(valor));
    if (carrinhoFinal.infoCredito[0]["parcelas"] == 1){
      $("#parcelaspg").html("À vista")
    }else {
    $("#parcelaspg").html(carrinhoFinal.infoCredito[0]["parcelas"] + " x de: " + Util.formataDuasCasas(valor / carrinhoFinal.infoCredito[0]["parcelas"]));
    }
    totalCompra()  
  }

  function totalCompra(){
    var valor = 0;
    for (var i in carrinho) {
      valor = valor + carrinho[i]["total"]
    }
    $("#vlrtotal").html(Util.formataDuasCasas((valor)));
    LoadPage('confirmacaopgto')  
  }
  // função para contar caracteres da mensagem escrita na pagina minhas informações
  $(document).on("input", "#mensg", function() {
    $(".restante").text("0");
    var limite = 200;
    var caracteresDigitados = $(this).val().length;
    var caracteresRestantes = limite - caracteresDigitados;

    if (caracteresRestantes <= 0) {
        var comentario = $("textarea[name=mensagem]").val();
        $("textarea[name=mensagem]").val(comentario.substr(0, limite));
        $(".restante").text("0");
    } else if (caracteresRestantes >= 16) {
    $( ".restante" ).css( "color", "#000000" );
        $(".restante").text(caracteresRestantes); 
    } else if (caracteresRestantes >= 0 && caracteresRestantes <= 15) {
      $( ".restante" ).css( "color", "red" );
          $(".restante").text(caracteresRestantes); 
    } else {
    $(".restante").text(caracteresRestantes);
    }
  });

  function carregaNoiva() {
    $(".page1").css("background-image", "url(" + fotoNoiva + ")");
    $(" #page2 .row1").css("background-image", "url(" + fotoNoiva + ")");
    $(" #page2 .row1 .row2 .col1-100").css("background-image", "url(" + fotoNoiva + ")");
    $(" .page1 li .item-media img").attr('src', fotoNoiva);
    $(" #final #nomedanoiva").html(nomeNoiva);
    $(".page1 li #nomenoiva b").html(nomeNoiva);
    $(".page2 li #nomenoiva1 b").html(nomeNoiva);
    for (var i in album){
      $("#albumFotos .swiper-wrapper").append(' <div class="swiper-slide" id="fotoswiper">'
          + '    <img src="' + album[i] + '"/>'
          + '  </div>');  
    }
    Swiper_Premium = myApp.swiper.create($('#album .swiper-container'), {

      pagination: {
        el: '.swiper-pagination'
      }
    });
    var demoGauge = myApp.gauge.create({
      el: '#porcentagem',
      
    });
    var value = ((vlrMeta * 100) / meta);
    demoGauge.update({
      value: value / 100,
    });
    $('#porcentagem img').attr('src', fotoNoiva);
    $('.data-text').html(value + '%');
  }
  function carregaEvento(){
    $(".page1 li #dataevento b").html(dataEvento);
    $(".page2 li #dataevento1 b").html(dataEvento);
    $(".page2 #mensagem").html(msgBvindas);
    $(".page4 #rua").html(rua);
    $(".page4 #numero").html(numero);
    $(".page4 #bairro").html(bairro);
    $(".page4 #cidade").html(cidade);
    $(".page4 #estado").html(estadoE);
  }
  function carregaConvidado(){
    $(" #page3 .no-hairlines-md li .item-media img").attr('src', fotoCon);
    $(" #page4 .no-hairlines-md li .item-media img").attr('src', fotoCon);
  }

  
