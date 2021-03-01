
// dev
import React from "react";
import { hydrate, render } from "react-dom";

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
