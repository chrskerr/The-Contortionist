
// dev
import React, { useState, useEffect, useReducer } from "react";
import _ from "lodash";
import useMedia from "./use-media";
import localforage from "localforage";
import { useSpring, animated as a } from "react-spring";
import { makeStyles } from "@material-ui/styles";

// app
import Main from "./main";
import Settings from "./settings";
import clsx from "clsx";

//
// App
//

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		display: "flex",
	},
	viewPort: {
		flexGrow: 1,
		position: "relative",
		width: "min(70vw, 40em)",
	},
	animated: {
		willChange: "transform, opacity",
		display: "flex", flexDirection: "column", 
		position: "absolute",
		top: 0, right: 0, left: 0, bottom: 0,
	},
	toggle: {
		position: "fixed",
		top: "1rem",
		zIndex: 15,
		"& button": {
			width: "1.5rem", height: "1.5rem",
			backgroundColor: "var(--alt-background)",
			padding: 0, border: "none",
			cursor: "pointer", borderRadius: "4px",
			"& span::before": {
				color: "var(--alt-paragraph)",
			},
		},
	},
	darkModeToggle: {
		right: "1rem",
	},
	settingsToggle: {
		right: "calc( 1rem + 1.5rem + 1rem )",
	},
});

export default function App () {
	const [ state, dispatch ] = useReducer( reducer, initialState );
	const { loaded, stretchesMap } = state;

	useEffect(() => {
		( async () => {
			const localState = await localforage.getItem( "state" );
			dispatch({ type: "loadLocalStorage", state: { ...localState, loaded: true }});
		})();
	}, []);
	
	useEffect(() => {
		localforage.setItem( "state", state );
	}, [ state ]);


	const [ darkMode, setDarkMode ] = useState( useMedia([ "(prefers-color-scheme: dark)" ], [ true ], false ));
	
	useEffect(() => {
		document.getElementById( "apple-mobile-web-app-status-bar-style" ).setAttribute( "content", darkMode ? "black-translucent" : "default" );
	}, [ darkMode ]);

	const [ isSettingsOpen, setIsSettingsOpen ] = useState( false );
	const { transform, opacity, width } = useSpring({
		opacity: isSettingsOpen ? 1 : 0,
		transform: `perspective(600px) rotateY(${ isSettingsOpen ? 180 : 0 }deg)`,
		config: { mass: 5, tension: 500, friction: 80 },
	});

	useEffect(() => {
		dispatch({ 
			type: "setActivitiesList",
			activitiesList: activitiesListGenerator( stretchesMap ),
		});
	}, [ stretchesMap ]);

	const classes = useStyles();

	if ( !loaded ) return null;
	
	return (
		<div className={ classes.root }>
			<div className={ classes.viewPort } style={{ width }}>
				<a.div className={ classes.animated } style={{ zIndex: isSettingsOpen ? 1 : 10, opacity: opacity.interpolate( o => 1 - o ), transform }}>
					<Main state={ state } dispatch={ dispatch } darkMode={ darkMode } />
				</a.div> 
				<a.div className={ classes.animated } style={{ zIndex: isSettingsOpen ? 10 : 1, opacity, transform: transform.interpolate( t => `${t} rotateY(180deg)` ) }}>
					<Settings state={ state } dispatch={ dispatch } />
				</a.div> 
			</div>
			<div className={ clsx( classes.toggle, classes.settingsToggle ) }>
				<button onClick={ () => setIsSettingsOpen( d => !d ) }>
					<span className={ isSettingsOpen ? "fa-x" : "fa-settings" } />
				</button>
			</div>
			<div className={ clsx( classes.toggle, classes.darkModeToggle ) }>
				<button onClick={ () => setDarkMode( d => !d ) }>
					<span className={ darkMode ? "fa-sun" : "fa-moon" } />
				</button>
			</div>

			<style>{`
				html {
					--background: ${ darkMode ? "#000" : "#ffffff" };
					--alt-background: ${ darkMode ? "#ffffff" : "#000" };
					
					--stroke: ${ darkMode ? "#121629" : "#272343" };
					--highlight: ${ darkMode ? "#eebbc3" : "#ffd803" };
					--secondary: ${ darkMode ? "#fffffe" : "#e3f6f5" };
					--tertiary: ${ darkMode ? "#eebbc3" : "#bae8e8" };
					--heading: ${ darkMode ? "#fffffe" : "#272343" };
					
					--paragraph: ${ darkMode ? "#b8c1ec" : "#2d334a" };
					--alt-paragraph: ${ darkMode ? "#2d334a" : "#b8c1ec" };
				}
			`}</style>
		</div>
	);
}

const stretchesMap = [
	{ name: "Glute", frequency: 3, bothSides: true },
	{ name: "Hamstring", frequency: 3, bothSides: true },
	{ name: "Quad", frequency: 3, bothSides: true },
	{ name: "Half Lotus", frequency: 2, bothSides: true },
	{ name: "Forearm", frequency: 2, bothSides: true },
	{ name: "Front Shoulder", frequency: 2, bothSides: true },
	{ name: "Standing Pike Stretch", bothSides: false, frequency: 1 },
	{ name: "Lat", frequency: 1, bothSides: true },
	{ name: "Pec", frequency: 1, bothSides: true },
	{ name: "Frog Stretch", frequency: 1, bothSides: false },
	{ name: "Calf", frequency: 1, hasRolling: false, bothSides: true },
];

const activitiesListGenerator = stretchesMap => {
	const loops = _.max( _.map( stretchesMap, "frequency" ));
	const extendedMap = _.reduce( _.range( 0, loops ), ( acc, loop ) => {
		return _.concat( acc, _.filter( stretchesMap, ({ frequency }) => frequency >= loop + 1 ));
	}, []);

	return _.reduce( extendedMap, ( acc, { name, bothSides = true }) => {
		const count = _.size( _.filter( acc, { name }));
		if ( !bothSides ) return _.concat( acc, { key: `${ name }-${ count }`, label: `${ _.startCase( name ) }`, name });
		else return _.concat( 
			acc,
			{ key: `${ name }-right-${ count }`, label: `Stretch Right ${ _.startCase( name ) }`, name },
			{ key: `${ name }-left-${ count }`, label: `Stretch Left ${ _.startCase( name ) }`, name },
		);
	}, []);
};


const reducer = ( state, action ) => {
	const { type, ...payload } = action;

	switch ( type ) {
	case "loadLocalStorage":
		return {
			...state,
			..._.get( payload, "state" ),
		};
	case "setCurrentKey":
		return {
			...state,
			currentKey: _.get( payload, "key" ),
		};
	case "setUseDefaultStretches":
		return {
			...state,
			useDefaultStretches: _.get( payload, "value" ),
			stretchesMap,
		};
	case "setActivitiesList":
		return {
			...state,
			activitiesList: _.get( payload, "activitiesList" ),
		};
	case "updateStretchesMap": 
		return {
			...state,
			stretchesMap: _.get( payload, "stretchesMap" ),
		};
	case "setDuration":
		return {
			...state,
			duration: _.get( payload, "value" ),
		};
	default: 
		return state;
	}
};

const initialState = {
	loaded: false,
	duration: 60 * 2.5,
	useDefaultStretches: true,
	stretchesMap,
	currentKey: null,
};
