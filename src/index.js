
// dev
import React from "react";
import { hydrate, render } from "react-dom";
import { Workbox } from "workbox-window";

// app
import "./css/index.css";
import App from "./views/app";

//
// Index 
//

const rootElement = document.getElementById( "root" );
if ( rootElement.hasChildNodes()) {
	hydrate( <App />, rootElement );
} else {
	render( <App />, rootElement );
}

if ( "serviceWorker" in navigator ) {
	const wb = new Workbox( "service-worker.js" );
   
	wb.addEventListener( "installed", event => {
		if ( event.isUpdate ) window.location.reload();
	});
  
	wb.register();
}
