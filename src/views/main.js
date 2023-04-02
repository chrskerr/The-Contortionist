// dev
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/styles';

// app
import logo from '../resources/logo.png';
import audioFile from '../resources/single-ding-sound-effect.mp3';
const audio = new Audio(audioFile);

//
// Main
//

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		padding: '2rem 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	header: {
		marginBottom: '1em',
		textAlign: 'center',
		'& img ': {
			width: 'min(95%, 25em)',
			filter: ({ darkMode }) =>
				darkMode ? 'invert(1) brightness(10)' : '',
		},
		'& p': {
			textAlign: 'justify',
		},
	},
	timer: {
		textAlign: 'center',
		width: '100%',
	},

	time: {
		textAlign: 'center',
		fontSize: 'min(25vw, 7em)',
		color: 'var(--highlight)',
	},

	controls: {
		width: '90%',
		margin: '0 auto',
		marginTop: '2em',
		display: 'flex',
		justifyContent: 'space-between',
	},
	buttonContainer: {
		width: 'min(25%, 8em)',
		height: '3em',
		'& button': {
			textAlign: 'center',
			borderRadius: '8px',
			border: 'none',
			height: '100%',
			width: '100%',
			background: 'var(--secondary)',
			overflow: 'hidden',
			padding: 0,
			cursor: 'pointer',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			'& span': {
				fontSize: '120%',
			},
		},
	},
});

export default function Main({ state, dispatch, darkMode }) {
	const classes = useStyles({ darkMode });
	const { duration, currentKey, activitiesList, currentActivityIndex } =
		state;

	const [timer, setTimer] = useState({
		secondsRemaining: duration,
		intervalRef: null,
		start: () =>
			setTimer(t => ({
				...t,
				intervalRef: setInterval(t.decrementSeconds, 1000),
			})),
		pause: () =>
			setTimer(t => {
				clearInterval(t.intervalRef);
				return { ...t, intervalRef: null };
			}),
		reset: duration =>
			setTimer(t => {
				clearInterval(t.intervalRef);
				return { ...t, intervalRef: null, secondsRemaining: duration };
			}),
		decrementSeconds: () =>
			setTimer(t => ({ ...t, secondsRemaining: t.secondsRemaining - 1 })),
	});
	const { secondsRemaining, intervalRef, start, pause, reset } = timer;
	const _isRunning = Boolean(intervalRef);
	const timeText = `${_.floor(secondsRemaining / 60)}:${
		secondsRemaining % 60 < 10
			? `0${secondsRemaining % 60}`
			: secondsRemaining % 60
	}`;

	const _isFirst = currentActivityIndex === 0;
	const _isLast = currentActivityIndex === _.size(activitiesList) - 1;

	const previousActivity = _isFirst
		? _.last(activitiesList)
		: _.nth(activitiesList, currentActivityIndex - 1);
	const currentActivity = _.nth(activitiesList, currentActivityIndex);
	const nextActivity = _isLast
		? _.head(activitiesList)
		: _.nth(activitiesList, currentActivityIndex + 1);

	const _handleNext = () => {
		dispatch({ type: 'setCurrentKey', key: _.get(nextActivity, 'key') });
		reset(duration);
	};

	const _handleStart = () => {
		start();
		audio.play();
		audio.pause();
	};

	const _handleBack = () => {
		if (_isRunning) reset(duration);
		else
			dispatch({
				type: 'setCurrentKey',
				key: _.get(previousActivity, 'key'),
			});
	};

	useEffect(() => {
		if (secondsRemaining <= 0) {
			audio.play();
			_handleNext();
		}
	}, [secondsRemaining]);

	useEffect(() => {
		reset(duration);
	}, [duration]);

	if (_.isUndefined(currentKey)) return null;

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<img src={logo} alt="Site logo, woman stretching" />
				<p>
					A rolling queue of stretches with a timer, a finish bell,
					and a record of where you left off last time.
				</p>
				<p>
					You can configure the duration and queue in the settings
					(top right), the defaults are based on what I&apos;m bad at
					:)
				</p>
			</div>
			<div>
				<h4>Current: {_.get(currentActivity, 'label')}</h4>
				<p className="-smaller">Next: {_.get(nextActivity, 'label')}</p>
			</div>
			<div className={classes.timer}>
				<div className={classes.time}>{timeText}</div>
				<div className={classes.controls}>
					<div className={classes.buttonContainer}>
						<button
							onClick={
								_isRunning ? () => reset(duration) : _handleBack
							}
							aria-label="back"
						>
							<span className="fa-chevrons-left" />
						</button>
					</div>
					<div className={classes.buttonContainer}>
						<button
							onClick={_isRunning ? pause : _handleStart}
							aria-label="play pause"
						>
							<span
								className={_isRunning ? 'fa-pause' : 'fa-play'}
							/>
						</button>
					</div>
					<div className={classes.buttonContainer}>
						<button onClick={_handleNext} aria-label="next">
							<span className="fa-chevrons-right" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
Main.propTypes = {
	state: PropTypes.object,
	dispatch: PropTypes.func,
	darkMode: PropTypes.bool,
};
