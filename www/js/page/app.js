// Dom7
var $$ = Dom7;

// Framework7 App main instance
var myApp = new Framework7({
  root: '#app',
  id: 'com.agely.nuclick',
  name: 'Framework7',
  theme: 'md',
  data: function () {
    return {
      versao: "",
      banco: "",
      teste: true,
      url_raiz: "https://sistemaagely.com.br/ajax",
    };
  },
});
/* view principal */
var View_Principal = myApp.views.create('.view-principal', {
  url: '/',
  stackPages: true,
  routes: [
    { path: "/home/", pageName: "home" },
    { path: "/listapresentes/", pageName: "listapresentes" },
    { path: "/presenteselect/", pageName: "presenteselect" },
    { path: "/carrinhofinal/", pageName: "carrinhofinal" },
    { path: "/minhasinformacoes/", pageName: "minhasinformacoes" },
    { path: "/meuendereco/", pageName: "meuendereco" },
    { path: "/pagamento/", pageName: "pagamento" },
    { path: "/confirmacaopgto/", pageName: "confirmacaopgto" },
    { path: "/final/", pageName: "final" },
    
  ]
});





