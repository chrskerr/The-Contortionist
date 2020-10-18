
// dev
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

// app
import logo from "./logo.png";

//
// App
//

const activityDurationSeconds = 60 * 2.5;

export default function App () {
	const [ selectedOptions, setSelectedOptions ] = useState({ stretching: true, rolling: true });

	const [ savedData, setSavedData ] = useState( JSON.parse( localStorage.getItem( "savedData" )));
	useEffect(() => {
		if ( !savedData ) setSavedData({ lastCompleted: null });
		localStorage.setItem( "savedData", JSON.stringify( savedData ));
	}, [ savedData ]);
	const lastCompleted = _.get( savedData, "lastCompleted" );
	
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

	const lastActivity = _.find( activitiesList, { key: lastCompleted });
	const { secondLast, currentActivity, nextActivity } = getNextActivities( lastCompleted, selectedOptions );
	useEffect(() => { 
		if ( secondsRemaining < 0 ) {
			// play bell
			setSavedData({ ...savedData, lastCompleted: _.get( currentActivity, "key" ) });
			reset(); 
		}
	}, [ secondsRemaining ]);

	const _handleNext = () => {
		setSavedData({ ...savedData, lastCompleted: _.get( currentActivity, "key" ) });
		reset();
	};

	const _handleBack = () => {
		if ( _isRunning ) reset();
		else if ( lastActivity ) {
			setSavedData({ ...savedData, lastCompleted: _.get( secondLast, "key" ) });
		}
	};

	return (
		<div className="body">
			<div className="header">
				<img src={ logo } alt="Site logo, woman stretching" />	
			</div>
			<div className="inputs-box-row">
				<div onClick={ () => setSelectedOptions({ ...selectedOptions, stretching: !selectedOptions.stretching }) }>
					<label>Include stretching</label>
					<FontAwesomeIcon icon={ selectedOptions.stretching ? faCheck : faTimes } />
				</div>
				<div onClick={ () => setSelectedOptions({ ...selectedOptions, rolling: !selectedOptions.rolling }) }>
					<label>Include foam rolling</label>
					<FontAwesomeIcon icon={ selectedOptions.rolling ? faCheck : faTimes } />
				</div>
			</div>
			<div>
				<p>A rolling queue of stretching and rolling activities with a timer and a memory of where you left off last time.</p>
			</div>
			<div className="current">
				<p className="-smaller">Previous activity: { _.get( lastActivity, "label" )}</p>
				<h5>Current activity: { _.get( currentActivity, "label" )}</h5>
				<p className="-smaller">Next activity: { _.get( nextActivity, "label" )}</p>
			</div>
			<div className="main">
				<div className="timer">
					<div className="time">
						{ timeText }
					</div>
					<div className="controls">
						<button onClick={ _isRunning ? reset : _handleBack }>Back</button>
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

const getNextActivities = ( lastCompleted, selectedOptions ) => {
	const lastActivityIndex = _.findIndex( activitiesList, { key: lastCompleted });

	const nextActivitiesList = _.concat( _.slice( activitiesList, lastActivityIndex + 1 ), activitiesList );
	const filteredNextActivitiesList = _.filter( nextActivitiesList, ({ type }) => ( type === "rolling" && selectedOptions.rolling ) || ( type === "stretching" && selectedOptions.stretching ));

	const prevActivitiesList = _.concat( _.reverse( _.slice( activitiesList, lastActivityIndex )), _.reverse( activitiesList ));
	const filteredPrevActivitiesList = _.filter( prevActivitiesList, ({ type }) => ( type === "rolling" && selectedOptions.rolling ) || ( type === "stretching" && selectedOptions.stretching ));

	console.log( "filteredNextActivitiesList", filteredNextActivitiesList );
	console.log( "filteredPrevActivitiesList", filteredPrevActivitiesList );

	return {
		currentActivity: _.nth( filteredNextActivitiesList, 0 ),
		nextActivity: _.nth( filteredNextActivitiesList, 1 ),
		secondLast: _.nth( filteredPrevActivitiesList, 0 ),
	};
};