(this["webpackJsonpthe-contortionist"]=this["webpackJsonpthe-contortionist"]||[]).push([[0],{12:function(e,t,n){},15:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(3),c=(n(12),n(2)),i=n(4),l=n(1),s=n.n(l),h=n(6),u=n.n(h),f=new Audio("./single-ding-sound-effect.mp3");f.load();function d(){var e=Object(a.useState)(JSON.parse(localStorage.getItem("savedData"))),t=Object(i.a)(e,2),n=t[0],o=t[1];Object(a.useEffect)((function(){n||o({lastCompleted:null}),localStorage.setItem("savedData",JSON.stringify(n))}),[n]);var l=s.a.get(n,"currentKey"),h=Object(a.useState)({secondsRemaining:150,intervalRef:null,start:function(){return v((function(e){return Object(c.a)(Object(c.a)({},e),{},{intervalRef:setInterval(e.decrementSeconds,1e3)})}))},pause:function(){return v((function(e){return clearInterval(e.intervalRef),Object(c.a)(Object(c.a)({},e),{},{intervalRef:null})}))},reset:function(){return v((function(e){return clearInterval(e.intervalRef),Object(c.a)(Object(c.a)({},e),{},{intervalRef:null,secondsRemaining:150})}))},decrementSeconds:function(){return v((function(e){return Object(c.a)(Object(c.a)({},e),{},{secondsRemaining:e.secondsRemaining-1})}))}}),d=Object(i.a)(h,2),m=d[0],v=d[1],b=m.secondsRemaining,p=m.intervalRef,y=m.start,R=m.pause,w=m.reset,S=Boolean(p),k="".concat(s.a.floor(b/60),":").concat(b%60<10?"0".concat(b%60):b%60),O=s.a.findIndex(g,{key:l}),j=s.a.nth(g,O-1),E=l?s.a.find(g,{key:l}):s.a.head(g),N=s.a.nth(s.a.concat(g,g),O+1),C=function(){o(Object(c.a)(Object(c.a)({},n),{},{currentKey:s.a.get(N,"key")})),w()};return Object(a.useEffect)((function(){b<=0&&(f.play(),C())}),[b]),r.a.createElement("div",{className:"body"},r.a.createElement("div",{className:"header"},r.a.createElement("img",{src:u.a,alt:"Site logo, woman stretching"}),r.a.createElement("p",null,"A rolling queue of ",s.a.size(g)," stretching and rolling activities with a timer and a record of where you left off last time. Try to do ",s.a.ceil(s.a.size(g)/7)," every day to get through every body part in a week.")),r.a.createElement("div",{className:"current"},r.a.createElement("p",{className:"-smaller"},"Previous activity: ",s.a.get(j,"label")),r.a.createElement("h4",null,"Current activity: ",s.a.get(E,"label")),r.a.createElement("p",{className:"-smaller"},"Next activity: ",s.a.get(N,"label"))),r.a.createElement("div",{className:"main"},r.a.createElement("div",{className:"timer"},r.a.createElement("div",{className:"time"},k),r.a.createElement("div",{className:"controls"},r.a.createElement("button",{onClick:S?w:function(){S?w():o(Object(c.a)(Object(c.a)({},n),{},{currentKey:s.a.get(j,"key")}))}},S?"Restart":"Back"),r.a.createElement("button",{onClick:S?R:y},S?"Pause":"Start"),r.a.createElement("button",{onClick:C},"Next")))))}var g=s.a.flatten(s.a.map([{name:"hamstring",hasStretch:!0,hasRolling:!0},{name:"glute",hasStretch:!0,hasRolling:!0},{name:"lat",hasStretch:!0,hasRolling:!0},{name:"pec",hasStretch:!0,hasRolling:!0},{name:"quad",hasStretch:!0,hasRolling:!0},{name:"hip-flexor",hasStretch:!0,hasRolling:!0},{name:"forearm",hasStretch:!0,hasRolling:!0},{name:"tricep",hasStretch:!0,hasRolling:!0},{name:"front-shoulder",hasStretch:!0,hasRolling:!1},{name:"groin",hasStretch:!0,hasRolling:!0},{name:"calf",hasStretch:!0,hasRolling:!0},{name:"trap",hasStretch:!1,hasRolling:!0}],(function(e){return function(e){var t=e.name,n=e.hasStretch,a=e.hasRolling,r=[];return n&&r.push({key:"".concat(t,"-stretch-right"),type:"stretching",label:"Stretch Right ".concat(s.a.startCase(t))},{key:"".concat(t,"-stretch-left"),type:"stretching",label:"Stretch Left ".concat(s.a.startCase(t))}),a&&r.push({key:"".concat(t,"-roll-right"),type:"rolling",label:"Foam Roll Right ".concat(s.a.startCase(t))},{key:"".concat(t,"-roll-left"),type:"rolling",label:"Foam Roll Left ".concat(s.a.startCase(t))}),r}(e)}))),m=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function v(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var b=document.getElementById("root");b.hasChildNodes()?Object(o.hydrate)(r.a.createElement(d,null),b):Object(o.render)(r.a.createElement(d,null),b),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");m?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):v(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):v(t,e)}))}}()},6:function(e,t,n){e.exports=n.p+"static/media/logo.82113bab.png"},7:function(e,t,n){e.exports=n(15)}},[[7,1,2]]]);
//# sourceMappingURL=main.3a4ab6d2.chunk.js.map