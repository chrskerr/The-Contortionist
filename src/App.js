
// dev
import React, { useState, useEffect } from "react";
import _ from "lodash";

// app
import logo from "./logo.png";
const bell = new Audio( "./single-ding-sound-effect.mp3" );
bell.load();


//
// App
//

const activityDurationSeconds = 60 * 2.5;

export default function App () {
	const [ savedData, setSavedData ] = useState( JSON.parse( localStorage.getItem( "savedData" )));
	useEffect(() => {
		if ( !savedData ) setSavedData({ lastCompleted: null });
		localStorage.setItem( "savedData", JSON.stringify( savedData ));
	}, [ savedData ]);
	const currentKey = _.get( savedData, "currentKey" );
	
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

	const currentActivityIndex = _.findIndex( activitiesList, { key: currentKey });

	const previousActivity = _.nth( activitiesList, currentActivityIndex - 1 );
	const currentActivity = currentKey ? _.find( activitiesList, { key: currentKey }) : _.head( activitiesList );
	const nextActivity = _.nth( _.concat( activitiesList, activitiesList ), currentActivityIndex + 1 );

	const _handleNext = () => {
		setSavedData({ ...savedData, currentKey: _.get( nextActivity, "key" ) });
		reset();
	};

	const _handleBack = () => {
		if ( _isRunning ) reset();
		else setSavedData({ ...savedData, currentKey: _.get( previousActivity, "key" ) });
	};

	useEffect(() => { 
		if ( secondsRemaining <= 0 ) {
			bell.play();
			_handleNext();
		}
	}, [ secondsRemaining ]);

	return (
		<div className="body">
			<div className="header">
				<img src={ logo } alt="Site logo, woman stretching" />	
				<p>A rolling queue of { _.size( activitiesList ) } stretching and rolling activities with a timer and a memory of where you left off last time.</p>
			</div>
			<div className="current">
				<p className="-smaller">Previous activity: { _.get( previousActivity, "label" )}</p>
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
						<button onClick={ _isRunning ? pause : start }>{ _isRunning ? "Pause" : "Start" }</button>
						<button onClick={ _handleNext }>Next</button>
					</div>
				</div>
			</div>
		</div>
	);
}

const activityBuilder = ({ name, hasStretch }) => hasStretch ? ([
	{ key: `${ name }-roll-right`, type: "rolling", label: `Foam Roll Right ${ _.startCase( name ) }` },
	{ key: `${ name }-roll-left`, type: "rolling", label: `Foam Roll Left ${ _.startCase( name ) }` },
	{ key: `${ name }-stretch-right`, type: "stretching", label: `Stretch Right ${ _.startCase( name ) }` },
	{ key: `${ name }-stretch-left`, type: "stretching", label: `Stretch Left ${ _.startCase( name ) }` },
]) : ([
	{ key: `${ name }-roll-right`, type: "rolling", label: `Foam Roll Right ${ _.startCase( name ) }` },
	{ key: `${ name }-roll-left`, type: "rolling", label: `Foam Roll Left ${ _.startCase( name ) }` },
]);

const bodyPartMap = [
	{ name: "hamstring", hasStretch: true },
	{ name: "glute", hasStretch: true },
	{ name: "lat", hasStretch: true },
	{ name: "pec", hasStretch: true },
	{ name: "quad", hasStretch: true },
	{ name: "hip-flexor", hasStretch: true },
	{ name: "forearm", hasStretch: true },
	{ name: "tricep", hasStretch: true },
	{ name: "groin", hasStretch: true },
	{ name: "calf", hasStretch: true },
	{ name: "trap", hasStretch: false },
];

const activitiesList = _.flatten( _.map( bodyPartMap, part => activityBuilder( part )));
