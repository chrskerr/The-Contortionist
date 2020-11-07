(this["webpackJsonpthe-contortionist"]=this["webpackJsonpthe-contortionist"]||[]).push([[0],{13:function(e,t,a){},16:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),o=a(3),c=(a(13),a(2)),l=a(4),i=a(0),s=a.n(i),u=a(6),f=a.n(u),h=a(7),d=new Audio(a.n(h).a);function m(){var e=Object(n.useState)(JSON.parse(localStorage.getItem("savedData"))),t=Object(l.a)(e,2),a=t[0],o=t[1];Object(n.useEffect)((function(){a||o({lastCompleted:null}),localStorage.setItem("savedData",JSON.stringify(a))}),[a]);var i=s.a.get(a,"currentKey"),u=Object(n.useState)({secondsRemaining:150,intervalRef:null,start:function(){return v((function(e){return Object(c.a)(Object(c.a)({},e),{},{intervalRef:setInterval(e.decrementSeconds,1e3)})}))},pause:function(){return v((function(e){return clearInterval(e.intervalRef),Object(c.a)(Object(c.a)({},e),{},{intervalRef:null})}))},reset:function(){return v((function(e){return clearInterval(e.intervalRef),Object(c.a)(Object(c.a)({},e),{},{intervalRef:null,secondsRemaining:150})}))},decrementSeconds:function(){return v((function(e){return Object(c.a)(Object(c.a)({},e),{},{secondsRemaining:e.secondsRemaining-1})}))}}),h=Object(l.a)(u,2),m=h[0],v=h[1],p=m.secondsRemaining,b=m.intervalRef,y=m.start,k=m.pause,w=m.reset,R=Boolean(b),O="".concat(s.a.floor(p/60),":").concat(p%60<10?"0".concat(p%60):p%60),j=s.a.findIndex(g,{key:i}),E=s.a.nth(g,j-1),S=i?s.a.find(g,{key:i}):s.a.head(g),N=s.a.nth(s.a.concat(g,g),j+1),C=function(){o(Object(c.a)(Object(c.a)({},a),{},{currentKey:s.a.get(N,"key")})),w()};return Object(n.useEffect)((function(){p<=0&&(d.play(),C())}),[p]),r.a.createElement("div",{className:"body"},r.a.createElement("div",{className:"header"},r.a.createElement("img",{src:f.a,alt:"Site logo, woman stretching"}),r.a.createElement("p",null,"A rolling queue of ",s.a.size(g)," stretching and rolling activities with a timer and a record of where you left off last time. Try to do ",s.a.ceil(s.a.size(g)/7)," every day to get through every body part in a week.")),r.a.createElement("div",{className:"current"},r.a.createElement("p",{className:"-smaller"},"Previous activity: ",s.a.get(E,"label")),r.a.createElement("h4",null,"Current activity: ",s.a.get(S,"label")),r.a.createElement("p",{className:"-smaller"},"Next activity: ",s.a.get(N,"label"))),r.a.createElement("div",{className:"main"},r.a.createElement("div",{className:"timer"},r.a.createElement("div",{className:"time"},O),r.a.createElement("div",{className:"controls"},r.a.createElement("button",{onClick:R?w:function(){R?w():o(Object(c.a)(Object(c.a)({},a),{},{currentKey:s.a.get(E,"key")}))}},R?"Restart":"Back"),r.a.createElement("button",{onClick:R?k:function(){y(),d.play(),d.pause()}},R?"Pause":"Start"),r.a.createElement("button",{onClick:C},"Next")))))}var g=s.a.flatten(s.a.map([{name:"standing-pike-stretch",unilateral:!1,hasRolling:!1},{name:"glute"},{name:"lat"},{name:"pec"},{name:"quad"},{name:"standing-pike-stretch",unilateral:!1,hasRolling:!1},{name:"frog-stretch",unilateral:!1,hasRolling:!1},{name:"calf",hasRolling:!1},{name:"hip-flexor"},{name:"forearm"},{name:"tricep"},{name:"half-lotus-right",unilateral:!1,hasRolling:!1},{name:"half-lotus-left",unilateral:!1,hasRolling:!1},{name:"front-shoulder",hasRolling:!1},{name:"groin",hasStretch:!1},{name:"frog-stretch",unilateral:!1,hasRolling:!1},{name:"calf"},{name:"trap",hasStretch:!1}],(function(e){return function(e){var t=e.name,a=e.hasStretch,n=void 0===a||a,r=e.hasRolling,o=void 0===r||r,c=e.unilateral,l=[];return void 0===c||c?(o&&l.push({key:"".concat(t,"-roll-right"),type:"rolling",label:"Foam Roll Right ".concat(s.a.startCase(t))},{key:"".concat(t,"-roll-left"),type:"rolling",label:"Foam Roll Left ".concat(s.a.startCase(t))}),n&&l.push({key:"".concat(t,"-stretch-right"),type:"stretching",label:"Stretch Right ".concat(s.a.startCase(t))},{key:"".concat(t,"-stretch-left"),type:"stretching",label:"Stretch Left ".concat(s.a.startCase(t))})):(o&&l.push({key:"".concat(t),type:"rolling",label:"".concat(s.a.startCase(t))}),n&&l.push({key:"".concat(t),type:"stretching",label:"".concat(s.a.startCase(t))})),l}(e)}))),v=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function p(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var a=e.installing;null!=a&&(a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){return console.error("Error during service worker registration:",e)}))}var b,y=document.getElementById("root");y.hasChildNodes()?Object(o.hydrate)(r.a.createElement(m,null),y):Object(o.render)(r.a.createElement(m,null),y),"serviceWorker"in navigator&&window.addEventListener("load",(function(){var e="".concat(window.location.href,"service-worker.js");v?(function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(a){var n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){return e.unregister().then((function(){return window.location.reload()}))})):p(e,t)})).catch((function(){return console.log("No internet connection found. App is running in offline mode.")}))}(e,b),navigator.serviceWorker.ready.then((function(){return console.log("This web app is being served cache-first by a service worker.")}))):p(e,b)}))},6:function(e,t,a){e.exports=a.p+"static/media/logo.82113bab.png"},7:function(e,t,a){e.exports=a.p+"static/media/single-ding-sound-effect.205fabcd.mp3"},8:function(e,t,a){e.exports=a(16)}},[[8,1,2]]]);
//# sourceMappingURL=main.d527574b.chunk.js.map