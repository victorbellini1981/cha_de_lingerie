function Listas(){//aqui é o nome da função
    //função sem parametro
    this.listaProdutos = function(){//o nome da função que vai ser chamada
      var GetProdutos = new Promessa("GetProdutos")//requimento da promessa/ se tiver algum parametro passar dentro de chaves
      GetProdutos.then(function(dados){//retorno da promessa
        if(dados["situacao"] == "sucesso"){//se retornar sucesso é porque deu certo
            listaProdutos(dados.obj);//se der certo chama o metodo de lista passando a lista
        }else{// se não printa uma mensagem na tela
            Toast(dados["msg"]);
        }
       
        
      });
     }
     this.listaEstados = function(){//o nome da função que vai ser chamada
      var GetCidades = new Promessa("GetCidades")//requimento da promessa/ se tiver algum parametro passar dentro de chaves
      GetCidades.then(function(dados){//retorno da promessa
        if(dados["situacao"] == "sucesso"){//se retornar sucesso é porque deu certo
            listaEstados(dados.obj);//se der certo chama o metodo de lista passando a lista
        }else{// se não printa uma mensagem na tela
            Toast(dados["msg"]);
        }
      });
     }
     this.listaCidades = function(){//o nome da função que vai ser chamada
      var GetCidades = new Promessa("GetCidades")//requimento da promessa/ se tiver algum parametro passar dentro de chaves
      GetCidades.then(function(dados){//retorno da promessa
        if(dados["situacao"] == "sucesso"){//se retornar sucesso é porque deu certo
            listaCidades(dados.obj);//se der certo chama o metodo de lista passando a lista
        }else{// se não printa uma mensagem na tela
            Toast(dados["msg"]);
        }
      });
     }
     //função com parametro
     this.detalhaProduto = function(data){//o nome da função que vai ser chamada
      var GetProduto = new Promessa("GetProduto", {referencia: data})//requimento da promessa/ se tiver algum parametro passar dentro de chaves
      GetProduto.then(function(dados){//retorno da promessa
        if(dados["situacao"] == "sucesso"){//se retornar sucesso é porque deu certo
            detalhaProduto(dados.obj);//se der certo chama o metodo de lista passando a lista
        }else{// se não printa uma mensagem na tela
            Toast(dados["msg"]);
        }
      });
     }
     this.idCidade = function(data){
       console.log(data)
      var GetCidade = new Promessa("GetCidade", {estado : data["estado"], nome_cidade: data["cidade"]});
      GetCidade.then(function(dados){
       
        if(dados["situacao"] == "sucesso"){
          auxpessoal.idcidade = dados.obj.idcidade;
        } else {
          Toast(dados["msg"]);
        }
      });      
     }

}

    