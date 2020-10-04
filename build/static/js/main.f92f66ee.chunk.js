(this["webpackJsonpmonday-integration-quickstart-app"]=this["webpackJsonpmonday-integration-quickstart-app"]||[]).push([[0],{100:function(e,n,t){},101:function(e,n,t){},102:function(e,n,t){},103:function(e,n,t){},105:function(e,n,t){},107:function(e,n,t){},109:function(e,n,t){"use strict";t.r(n);var a=t(2),r=t.n(a),i=t(63),c=t.n(i),o=t(64),l=t(65),s=t(72),u=t(70),m=t(42),d=(t(78),t(11)),g=t(66),b=t(32),v=t.n(b),p=(Object(d.makeVar)(),Object(d.makeVar)()),E=t(25);function f(){var e=Object(E.a)(["\n    query Me($ids: [Int!]) {\n      me {\n        id\n        name\n      }\n      boards(ids: $ids) {\n        items {\n          id\n          name\n          subscribers {\n            id\n          }\n          group {\n            id\n            title\n          }\n        }\n      }\n    }\n  "]);return f=function(){return e},e}function O(){var e=Object(E.a)(["\n    query Me {\n      me {\n        id\n        name\n        photo_original\n      }\n    }\n  "]);return O=function(){return e},e}function h(){var e=Object(E.a)(["\n    query BoardSubscribers($ids: [Int!]) {\n      boards(ids: $ids) {\n        subscribers {\n          id\n          name\n        }\n      }\n    }\n  "]);return h=function(){return e},e}function y(){var e=Object(E.a)(["\n    query BoardName($ids: [Int!]) {\n      me {\n        id\n        name\n        photo_original\n      }\n      boards(ids: $ids) {\n        name\n      }\n    }\n  "]);return y=function(){return e},e}var j={BOARD:Object(d.gql)(y()),SUBSCRIBERS:Object(d.gql)(h()),CURRENT_USER:Object(d.gql)(O()),USERS_ITEMS:Object(d.gql)(f())};t(100),t(101);var w=function(e){var n=e.large,t=e.medium,a=e.secondary,i=e.tertiary,c=e.text,o="";return o=n?"btn-large ":t?"btn-medium ":"btn-small ",o+=i?"custom-btn-tertiary ":a?"custom-btn-secondary ":"custom-btn-primary ",r.a.createElement("span",{className:o},r.a.createElement("p",{style:{display:"inline-block"}},c))};t(102);var k=function(){return console.log("add new"),r.a.createElement("div",{className:"add-new"},r.a.createElement("p",{className:"text"},"Create a new ",r.a.createElement("strong",null,"campaign"),", ",r.a.createElement("strong",null,"project")," or"," ",r.a.createElement("strong",null,"event"),"."),r.a.createElement(w,{medium:!0,text:"Add New"}))},N=t(71),I=(t(103),t(41)),x=t(69),J=v()(),S=[];J.storage.instance.getItem("campaigns").then((function(e){var n=e.data,t=n.value;n.version;if(console.log(t),t&&t.length>0)S=JSON.parse(t);else{var a=[{id:1,name:"Marketing Campaign Example"},{id:2,name:"Restuarant Launch Example"}];J.storage.instance.setItem("campaigns",JSON.stringify(a)).then((function(e){console.log(e)})),S=a}}));var C=function(){var e=Object(a.useState)(S),n=Object(N.a)(e,2),t=n[0];return n[1],t.length>0?r.a.createElement(I.a,{className:"existing"},r.a.createElement(x.a,null,t.map((function(e){return r.a.createElement(I.a,null,r.a.createElement("p",{key:e.id},e.name))})))):null};var M=function(){var e=Object(d.useQuery)(j.BOARD,{variables:{ids:p()}}),n=e.loading,t=e.error;return e.data,n?null:t?r.a.createElement("p",null,"Error :("):r.a.createElement("div",null,r.a.createElement("div",{className:"header"},r.a.createElement(k,null),r.a.createElement(C,null)))},q=v()();p([0]);var A=Object(d.createHttpLink)({uri:"https://api.monday.com/v2/"}),D=Object(g.a)((function(e,n){var t=n.headers,a="eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU4NzkyNDMyLCJ1aWQiOjE0OTcwODg2LCJpYWQiOiIyMDIwLTA3LTExVDE3OjUxOjA2LjAwMFoiLCJwZXIiOiJtZTp3cml0ZSJ9.uC-owvux2QA0OdtWec5QcxxMNMFNtDWPDtHsyRkz3DQ";return{headers:Object(m.a)(Object(m.a)({},t),{},{authorization:"Bearer ".concat(a)})}})),R=new d.ApolloClient({link:D.concat(A),cache:new d.InMemoryCache}),B=function(e){Object(s.a)(t,e);var n=Object(u.a)(t);function t(e){var a;return Object(o.a)(this,t),(a=n.call(this,e)).state={settings:{},name:"",triggerEvent:null},a}return Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;q.get("context").then((function(e){p(e.data.boardIds[0])}));q.listen("events",(function(n){e.setState({triggerEvent:n.data})}))}},{key:"render",value:function(){return r.a.createElement(d.ApolloProvider,{client:R},r.a.createElement("div",{className:"App"},r.a.createElement(M,{key:this.state.triggerEvent})))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));t(104),t(105),t(106),t(107);c.a.render(r.a.createElement(B,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},73:function(e,n,t){e.exports=t(109)},78:function(e,n,t){}},[[73,1,2]]]);
//# sourceMappingURL=main.f92f66ee.chunk.js.map