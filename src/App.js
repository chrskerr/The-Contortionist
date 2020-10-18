
// dev
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

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

	const filteredActivityList = _.filter( activitiesList, ({ type }) => ( type === "rolling" && selectedOptions.rolling ) || ( type === "stretching" && selectedOptions.stretching ));
	
	const lastActivityIndex = _.findIndex( filteredActivityList, { key: lastCompleted });
	const lastActivity = _.find( filteredActivityList, { key: lastCompleted });

	const currentActivity = lastCompleted ? _.nth( _.concat( filteredActivityList, filteredActivityList ), lastActivityIndex + 1 ) : _.nth( filteredActivityList, 0 );
	const nextActivity = lastCompleted ? _.nth( _.concat( filteredActivityList, filteredActivityList ), lastActivityIndex + 2 ) : _.nth( filteredActivityList, 1 );

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
			const newLastUpdated = _.nth( filteredActivityList, lastActivityIndex - 1 );
			console.log( newLastUpdated );
			setSavedData({ ...savedData, lastCompleted: _.get( newLastUpdated, "key" ) });
		}
	};

	return (
		<div className="body">
			<div className="header">
				<h2>The Contortionist</h2>
				<p>An infinite queue of stretching and rolling recommendations with a timer and a memory of where you left off last time.</p>
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
			</div>
			<div className="main">
				<div className="current">
					<p className="-smaller">Previous activity: { _.get( lastActivity, "label" )}</p>
					<h5>Current activity: { _.get( currentActivity, "label" )}</h5>
					<p className="-smaller">Next activity: { _.get( nextActivity, "label" )}</p>
				</div>
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