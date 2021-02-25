
// dev
import React, { useState, useEffect } from "react";
import _ from "lodash";
import localforage from "localforage";
import useMedia from "./use-media";

// app
import logo from "./logo.png";
import audioFile from "./single-ding-sound-effect.mp3";
const audio = new Audio( audioFile );

//
// App
//

const activityDurationSeconds = 60 * 2.5;

export default function App () {
	const [ currentKey, setCurrentKey ] = useState();
	const [ darkMode, setDarkMode ] = useState( useMedia([ "(prefers-color-scheme: dark)" ], [ true ], false ));

	useEffect(() => {
		( async () => setCurrentKey( await localforage.getItem( "currentKey" )))();
	}, []);

	useEffect(() => {
		localforage.setItem( "currentKey", currentKey );
	}, [ currentKey ]);

	const _setViewHeight = _.debounce(() => {
		const newViewHeight = _.get( window, "innerHeight" );
		const el = document.getElementById( "root" );
		el.setAttribute( "style", `height: ${ newViewHeight }; max-height: ${ newViewHeight };` );
	}, 100 );

	useEffect(() => {
		_setViewHeight();
		window.addEventListener( "resize", _setViewHeight );
		return () => window.removeEventListener( "resize" );
	}, []);

	useEffect(() => {
		document.body.setAttribute( "class", darkMode ? "-dark-mode" : "" );
		document.getElementById( "apple-mobile-web-app-status-bar-style" ).setAttribute( "content", darkMode ? "black-translucent" : "default" );
	}, [ darkMode ]);
	
	const [ timer, setTimer ] = useState({ 
		secondsRemaining: activityDurationSeconds,
		intervalRef: null,
		start: () => setTimer( t => ({ ...t, intervalRef: setInterval( t.decrementSeconds, 1000 ) })),
		pause: () => setTimer( t => {
			clearInterval( t.intervalRef );
			return { ...t, intervalRef: null };
		}),
		reset: () => setTimer( t => {
			clearInterval( t.intervalRef );
			return { ...t, intervalRef: null, secondsRemaining: activityDurationSeconds };
		}),
		decrementSeconds: () => setTimer( t => ({ ...t, secondsRemaining: t.secondsRemaining - 1 })),
	});
	const { secondsRemaining, intervalRef, start, pause, reset } = timer;
	const _isRunning = Boolean( intervalRef );
	const timeText = `${ _.floor( secondsRemaining / 60 )}:${ secondsRemaining%60 < 10 ? `0${ secondsRemaining%60 }` : secondsRemaining%60 }`;

	const activitiesList = activitiesListGenerator({ includeRolling: false });
	const currentActivityIndex = _.findIndex( activitiesList, { key: currentKey }) || 0;

	const _isFirst = currentActivityIndex === 0;
	const _isLast = currentActivityIndex === _.size( activitiesList ) - 1;

	const previousActivity = _isFirst ? _.last( activitiesList ) : _.nth( activitiesList, currentActivityIndex - 1 );
	const currentActivity = _.nth( activitiesList, currentActivityIndex );
	const nextActivity = _isLast ? _.head( activitiesList ) : _.nth( activitiesList, currentActivityIndex + 1 );

	const _handleNext = () => {
		setCurrentKey( _.get( nextActivity, "key" ));
		reset();
	};

	const _handleStart = () => {
		start();
		audio.play();
		audio.pause();
	};

	const _handleBack = () => {
		if ( _isRunning ) reset();
		else setCurrentKey( _.get( previousActivity, "key" ));
	};

	useEffect(() => { 
		if ( secondsRemaining <= 0 ) {
			audio.play();
			_handleNext();
		}
	}, [ secondsRemaining ]);

	if ( _.isUndefined( currentKey )) return null;

	return (
		<div className="body" id="body">
			<div className="header">
				<img src={ logo } alt="Site logo, woman stretching" />	
				<p>A rolling queue of { _.size( activitiesList ) } stretching activities with a timer and a record of where you left off last time. Try to do { _.ceil( _.size( activitiesList ) / 7 ) } every day to get through every body part in a week.</p>
			</div>
			<div className="current">
				<h4>Current activity: { _.get( currentActivity, "label" )}</h4>
				<p className="-smaller">Next activity: { _.get( nextActivity, "label" )}</p>
			</div>
			<div className="main">
				<div className="timer">
					<div className="time">
						{ timeText }
					</div>
					<div className="controls">
						<button onClick={ _isRunning ? reset : _handleBack }>{ _isRunning ? "Restart" : "Back" }</button>
						<button onClick={ _isRunning ? pause : _handleStart }>{ _isRunning ? "Pause" : "Start" }</button>
						<button onClick={ _handleNext }>Next</button>
					</div>
				</div>
			</div>
			<div className="dark-mode-toggle">
				<button onClick={ () => setDarkMode( d => !d ) }>
					<span className={ darkMode ? "fa-sun" : "fa-moon" } />
				</button>
			</div>
		</div>
	);
}

const activityBuilder = ({ name, hasStretch = true, hasRolling = true, unilateral = true }, includeRolling, i ) => {
	const output = [];

	if ( unilateral ) {	
		if ( hasRolling && includeRolling ) output.push(
			{ key: `${ name }-roll-right-${ i }`, type: "rolling", label: `Foam Roll Right ${ _.startCase( name ) }` },
			{ key: `${ name }-roll-left-${ i }`, type: "rolling", label: `Foam Roll Left ${ _.startCase( name ) }` },
		);

		if ( hasStretch ) output.push(
			{ key: `${ name }-stretch-right-${ i }`, type: "stretching", label: `Stretch Right ${ _.startCase( name ) }` },
			{ key: `${ name }-stretch-left-${ i }`, type: "stretching", label: `Stretch Left ${ _.startCase( name ) }` },
		);
	}
	else {
		if ( hasRolling && includeRolling ) output.push({ key: `${ name }-${ i }`, type: "rolling", label: `${ _.startCase( name ) }` });
		if ( hasStretch ) output.push({ key: `${ name }-${ i }`, type: "stretching", label: `${ _.startCase( name ) }` });
	}

	return output;
};

const bodyPartMap = [
	{ name: "standing-pike-stretch", unilateral: false, hasRolling: false },
	{ name: "glute" },
	{ name: "lat" },
	{ name: "pec" },
	{ name: "quad" },
	{ name: "hamstring", hasRolling: false },
	{ name: "frog-stretch", unilateral: false, hasRolling: false },
	{ name: "calf", hasRolling: false },
	{ name: "quad" },
	{ name: "forearm" },
	{ name: "tricep" },
	{ name: "lotus", hasRolling: false },
	{ name: "front-shoulder", hasRolling: false },
	{ name: "quad" },
	{ name: "groin", hasStretch: false },
	{ name: "frog-stretch", unilateral: false, hasRolling: false },
	{ name: "calf" },
	{ name: "trap", hasStretch: false },
];

const activitiesListGenerator = ({ includeRolling = false }) => _.flatten( _.map( bodyPartMap, ( part, i ) => activityBuilder( part, includeRolling, i )));
