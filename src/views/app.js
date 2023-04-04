// dev
import React, { useState, useEffect, useReducer } from 'react';
import _ from 'lodash';
import useMedia from './use-media';
import localforage from 'localforage';
import { useSpring, animated as a } from 'react-spring';
import { makeStyles } from '@material-ui/styles';
import { Popover } from '@material-ui/core';
import clsx from 'clsx';

// app
import Main from './main';
import Settings from './settings';

//
// App
//

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		display: 'flex',
	},
	viewPort: {
		flexGrow: 1,
		position: 'relative',
		width: 'min(70vw, 40em)',
	},
	animated: {
		willChange: 'transform, opacity',
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
	},
	toggle: {
		position: 'fixed',
		top: '1rem',
		zIndex: 15,
		padding: 0,
		margin: 0,
		'& button': {
			width: '1.8rem',
			height: '1.8rem',
			backgroundColor: 'var(--alt-background)',
			padding: 0,
			margin: 0,
			border: 'none',
			cursor: 'pointer',
			borderRadius: '4px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			'& span::before': {
				color: 'var(--alt-paragraph)',
				fontSize: '100%',
			},
		},
	},
	darkModeToggle: {
		right: '1rem',
	},
	settingsToggle: {
		right: 'calc( 1rem + 1.5rem + 1rem )',
	},
	queueToggle: {
		right: 'calc( 1rem + 1.5rem + 1rem + 1.5rem + 1rem )',
	},
	popover: {
		'& .MuiPaper-root': {
			marginTop: '8px',
			padding: '1.5rem',
			maxHeight: '70vh',
			maxWidth: '70vw',
		},
	},
	list: {
		/**
		 *
		 * @param {{count: number}} param0
		 * @returns
		 */
		columnCount: ({ count }) => _.clamp(_.ceil(count / 20), 1, 3),
		columnGap: '1.5rem',
		'& li': {
			fontSize: '75%',
			width: '90%',
		},
		'& .current': {
			fontWeight: 900,
		},
	},
});

export default function App() {
	/** @type {[State, (action: {type: string, state: State}) => void]} */
	const [state, dispatch] = useReducer(reducer, initialState);
	const { loaded, stretchData, activitiesList, currentActivityIndex } = state;

	useEffect(() => {
		(async () => {
			/** @type {State} */
			const localState =
				(await localforage.getItem('state')) ?? initialState;
			const activitiesList = activitiesListGenerator(
				localState.stretchData || stretchData,
			);
			const currentActivityIndex = _.clamp(
				_.findIndex(activitiesList, {
					key: localState.currentKey ?? undefined,
				}),
				0,
				Infinity,
			);
			dispatch({
				type: 'loadLocalStorage',
				state: {
					...localState,
					loaded: true,
					activitiesList,
					currentActivityIndex,
				},
			});
		})();
	}, []);

	useEffect(() => {
		localforage.setItem(
			'state',
			_.omit(state, ['activitiesList', 'loaded', 'currentActivityIndex']),
		);
	}, [state]);

	const [darkMode, setDarkMode] = useState(
		useMedia(['(prefers-color-scheme: dark)'], [true], false),
	);

	useEffect(() => {
		document
			.getElementById('apple-mobile-web-app-status-bar-style')
			?.setAttribute(
				'content',
				darkMode ? 'black-translucent' : 'default',
			);
	}, [darkMode]);

	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { transform, opacity, width } = useSpring({
		opacity: isSettingsOpen ? 1 : 0,
		transform: `perspective(600px) rotateY(${isSettingsOpen ? 180 : 0}deg)`,
		config: { mass: 5, tension: 500, friction: 80 },
	});

	const [anchorEl, setAnchorEl] = useState(null);

	const classes = useStyles({ count: _.size(activitiesList) });

	if (!loaded) return null;

	return (
		<div className={classes.root}>
			<div className={classes.viewPort} style={{ width }}>
				<a.div
					className={classes.animated}
					style={{
						zIndex: isSettingsOpen ? 1 : 10,
						opacity: opacity.interpolate(o =>
							o ? 1 - Number(o) : 1,
						),
						transform,
					}}
				>
					<Main
						state={state}
						dispatch={dispatch}
						darkMode={darkMode}
					/>
				</a.div>
				<a.div
					className={classes.animated}
					style={{
						display: isSettingsOpen ? '' : 'none',
						zIndex: isSettingsOpen ? 10 : 1,
						opacity,
						transform: transform.interpolate(
							t => `${t} rotateY(180deg)`,
						),
					}}
				>
					<Settings state={state} dispatch={dispatch} />
				</a.div>
			</div>
			<div className={clsx(classes.toggle, classes.queueToggle)}>
				<button
					onClick={e => setAnchorEl(e.currentTarget)}
					aria-label="open queue"
				>
					<span className={anchorEl ? 'fa-x' : 'fa-list'} />
				</button>
			</div>
			<div
				className={clsx(classes.toggle, classes.settingsToggle)}
				aria-label="toggle settings open and closed"
			>
				<button onClick={() => setIsSettingsOpen(d => !d)}>
					<span className={isSettingsOpen ? 'fa-x' : 'fa-settings'} />
				</button>
			</div>
			<div
				className={clsx(classes.toggle, classes.darkModeToggle)}
				aria-label="toggle night mod"
			>
				<button onClick={() => setDarkMode(d => !d)}>
					<span className={darkMode ? 'fa-sun' : 'fa-moon'} />
				</button>
			</div>

			<Popover
				className={classes.popover}
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				BackdropProps={{ invisible: false }}
			>
				<div>
					<h5>Whole Stretching Loop</h5>
					<ol className={classes.list}>
						{!_.isEmpty(activitiesList) &&
							_.map(activitiesList, ({ key, label }, i) => (
								<li
									key={key}
									className={
										i === currentActivityIndex
											? 'current'
											: ''
									}
								>
									{label}
								</li>
							))}
					</ol>
				</div>
			</Popover>

			<style>{`
				html {
					--background: ${darkMode ? '#000' : '#ffffff'};
					--alt-background: ${darkMode ? '#ffffff' : '#000'};
					
					--stroke: ${darkMode ? '#121629' : '#272343'};
					--highlight: ${darkMode ? '#eebbc3' : '#ffd803'};
					--secondary: ${darkMode ? '#fffffe' : '#e3f6f5'};
					--tertiary: ${darkMode ? '#eebbc3' : '#bae8e8'};
					--heading: ${darkMode ? '#fffffe' : '#272343'};
					
					--paragraph: ${darkMode ? '#b8c1ec' : '#2d334a'};
					--alt-paragraph: ${darkMode ? '#2d334a' : '#b8c1ec'};
				}
			`}</style>
		</div>
	);
}

/** @typedef {{name: string, frequency: number, bothSides: boolean}} StretchData  */

/** @type {StretchData[]} */
const stretchData = [
	{ name: 'Glute', frequency: 3, bothSides: true },
	{ name: 'Hamstring', frequency: 3, bothSides: true },
	{ name: 'Quad', frequency: 2, bothSides: true },
	{ name: 'Half Lotus', frequency: 1, bothSides: true },
	{ name: 'Forearms', frequency: 1, bothSides: false },
	{ name: 'Front Shoulders', frequency: 2, bothSides: false },
	{ name: 'Standing Pike Stretch', bothSides: false, frequency: 1 },
	{ name: 'Lat', frequency: 1, bothSides: true },
	{ name: 'Pec', frequency: 1, bothSides: true },
	{ name: 'Frog Stretch', frequency: 2, bothSides: false },
	{ name: 'Calf', frequency: 1, bothSides: true },
];

/** @typedef {{key: string, label: string, name: string}} StretchDisplayData */

/**
 *
 * @param {StretchData[]} input
 */
const activitiesListGenerator = input => {
	if (_.isEmpty(input)) return [];

	const loops = _.max(_.map(input, 'frequency'));
	const extendedMap = _.reduce(
		_.range(0, loops),
		/**
		 *
		 * @param {StretchData[]} acc
		 * @param {number} loop
		 * @returns {StretchData[]}
		 */
		(acc, loop) => {
			return _.concat(
				acc,
				_.filter(input, ({ frequency }) => frequency >= loop + 1),
			);
		},
		[],
	);

	return _.reduce(
		extendedMap,
		/**
		 *
		 * @param {StretchDisplayData[]} acc
		 * @param {StretchData} param1
		 * @returns {StretchDisplayData[]}
		 */
		(acc, { name, bothSides }) => {
			const count = _.size(_.filter(acc, { name }));
			if (!bothSides)
				return acc.concat({
					key: `${name}-${count}`,
					label: `${_.startCase(name)}`,
					name,
				});
			else
				return acc
					.concat({
						key: `${name}-right-${count}`,
						label: `Stretch Right ${_.startCase(name)}`,
						name,
					})
					.concat({
						key: `${name}-left-${count}`,
						label: `Stretch Left ${_.startCase(name)}`,
						name,
					});
		},
		[],
	);
};

/** @typedef {{
 * loaded: boolean,
 * duration: number,
 * useDefaultStretches: boolean,
 * stretchData: StretchData[],
 * currentKey: string | null,
 * currentActivityIndex: number,
 * activitiesList: StretchDisplayData[]
 * }} State */

/**
 *
 * @param {State} state
 * @param {*} action
 * @returns
 */
const reducer = (state, action) => {
	const { type, ...payload } = action;

	switch (type) {
		case 'loadLocalStorage':
			return {
				...state,
				..._.get(payload, 'state'),
			};
		case 'setCurrentKey':
			return {
				...state,
				currentKey: _.get(payload, 'key'),
				currentActivityIndex: _.clamp(
					_.findIndex(_.get(state, 'activitiesList'), {
						key: _.get(payload, 'key'),
					}),
					0,
					Infinity,
				),
			};
		case 'setUseDefaultStretches':
			return {
				...state,
				useDefaultStretches: _.get(payload, 'value'),
				stretchesMap: stretchData,
			};
		case 'updateStretchesMap':
			return {
				...state,
				stretchesMap: _.get(payload, 'stretchesMap'),
				activitiesList: activitiesListGenerator(
					_.get(payload, 'stretchesMap'),
				),
			};
		case 'setDuration':
			return {
				...state,
				duration: _.get(payload, 'value'),
			};
		default:
			return state;
	}
};

/** @type {State} */
const initialState = {
	loaded: false,
	duration: 60 * 2.5,
	useDefaultStretches: true,
	stretchData,
	currentKey: null,
	currentActivityIndex: 0,
	activitiesList: [],
};
