
// dev
import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Popover from "@material-ui/core/popover";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

// app


//
// Settings
//

const useStyles = makeStyles({
	root: {
		flexGrow: 1, padding: "4rem 0",
		display: "flex", flexDirection: "column",
		margin: "0 auto",

		"& *": {
			animation: "$fadein 150ms",
			willChange: "opacity",
		},
	},
	header: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: "1.5rem",
		"& > *": {
			minWidth: "13rem",
		},
		"& > div": {
			display: "flex",
			justifyContent: "space-between",
		},
		"& button": {
			background: "var(--tertiary)",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			border: "none",
			borderRadius: "4px",
			padding: "0.3rem 0.6rem",
			cursor: "pointer",
			fontSize: "80%",
		},
	},
	input: {
		display: "flex",
		alignItems: "center",
		marginBottom: "1rem",
		flexWrap: "wrap",
		"& > *": {
			margin: "0 0.5rem 1rem 0.5rem", padding: 0,
			maxWidth: "50vw",
		},
	},
	borderBottom: {
		borderBottom: "1px dashed lightgrey",
	},
	deleteButton: {
		background: "var(--highlight)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		border: "none",
		borderRadius: "4px",
		padding: "0.3rem 0.4rem",
		cursor: "pointer",
		fontSize: "70%",
		"& span": {
			padding: 0, margin: 0,
		},
	},
	addButton: {
		background: "var(--secondary)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		border: "none",
		borderRadius: "4px",
		padding: "0.3rem 0.4rem",
		cursor: "pointer",
		fontSize: "70%",
		"& span": {
			padding: 0, margin: 0,
		},
	},
	disabledButton: {
		opacity: 0.25,
	},
	popover: {
		"& .MuiPaper-root": {
			marginTop: "8px",
			padding: "1.5rem",
			maxHeight: "70vh",
			maxWidth: "70vw",
		},
	},
	"@keyframes fadein": {
		from: {
			opacity: 0,
		},
		to: {
			opacity: 1,
		},
	},
});

export default function Settings ({ state, dispatch }) {
	const { duration, useDefaultStretches, stretchesMap, activitiesList } = state;
	const classes = useStyles();

	const [ subPage, setSubPage ] = useState( false );
	const [ anchorEl, setAnchorEl ] = useState( false );
	const [ newStretch, setNewStretch ] = useState({ name: "", frequency: 1, bothSides: true });
	
	const openPopover = ( e, page ) => {
		setSubPage( page );
		setAnchorEl( e.currentTarget );
	};

	const closePopopver = () => {
		setSubPage( false );
		setAnchorEl( false );
	};

	return (
		<div className={ classes.root }>
			<div className={ classes.header }>
				<h4>Settings:</h4>
				<div>
					<button onClick={ e => openPopover( e, "guide" ) }>
					Guide
					</button>
					<button onClick={ e => openPopover( e, "queue" ) }>
					Show Queue
					</button>
				</div>
			</div>
			<Popover
				className={ classes.popover }
				open={ Boolean( subPage )}
				anchorEl={ anchorEl }
				onClose={ closePopopver }
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
					// horizontal: subPage === "queue" ? "right" : "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
					// horizontal: subPage === "queue" ? "right" : "center",
				}}
			>
				{ subPage === "guide" && <Guide /> }
				{ subPage === "queue" && <Queue activitiesList={ activitiesList } /> }
			</Popover>
			<div className={ classes.input }>
				<h5>Duration:</h5>
				<InputText 
					value={ duration }
					onChange={ value => dispatch({ type: "setDuration", value: Number( value ) })}
				/>
				<p>seconds &asymp; { _.round( duration / 60, 1 ) } mins</p>
			</div>

			<div className={ classes.input }>
				<h5>Use Default Stretches?:</h5>
				<Toggle 
					checked={ useDefaultStretches } 
					onChange={ () => dispatch({ type: "setUseDefaultStretches", value: !useDefaultStretches }) }
				/>
			</div>
			{ !_.isEmpty( stretchesMap ) && _.map( _.concat( stretchesMap ), ( stretch, i ) => (
				<div className={ clsx( classes.input, classes.borderBottom ) } key={ i }>
					<InputText
						disabled={ useDefaultStretches}
						label="Name"
						value={ _.get( stretch, "name" ) }
						onChange={ name => dispatch({ 
							type: "updateStretchesMap", 
							stretchesMap: _.map( stretchesMap, ( el, j ) => i != j ? el : { ...el, name }), 
						})} 
					/>
					<InputText 
						disabled={ useDefaultStretches}
						label="Frequency"
						value={ _.get( stretch, "frequency" ) }
						onChange={ frequency => dispatch({ 
							type: "updateStretchesMap", 
							stretchesMap: _.map( stretchesMap, ( el, j ) => i != j ? el : { ...el, frequency: Number( frequency ) }), 
						})} 
					/>
					<Toggle 
						disabled={ useDefaultStretches}
						label="Both Sides"
						checked={ _.get( stretch, "bothSides" )}
						onChange={ () => dispatch({ 
							type: "updateStretchesMap", 
							stretchesMap: _.map( stretchesMap, ( el, j ) => i != j ? el : { ...el, custom: !_.get( stretch, "custom" ) }), 
						})}
					/>
					<button 
						disabled={ useDefaultStretches }
						className={ clsx( classes.deleteButton, { [ classes.disabledButton ]: useDefaultStretches }) }
						onClick={ () => dispatch({
							type: "updateStretchesMap",
							stretchesMap: _.reject( stretchesMap, ( el, j ) => i === j ),
						})}
					>
							Delete
					</button>
				</div>
			))}
			<div className={ classes.input }>
				<InputText
					disabled={ useDefaultStretches}
					label="Name"
					value={ _.get( newStretch, "name" ) }
					onChange={ name => setNewStretch( ns => ({ ...ns, name })) } 
				/>
				<InputText 
					disabled={ useDefaultStretches}
					label="Frequency"
					value={ _.get( newStretch, "frequency" ) }
					onChange={ frequency => setNewStretch( ns => ({ ...ns, frequency: Number( frequency ) })) } 
				/>
				<Toggle 
					disabled={ useDefaultStretches}
					label="Both Sides"
					checked={ _.get( newStretch, "bothSides" )}
					onChange={ () => setNewStretch( ns => ({ ...ns, custom: !ns.custom })) }
				/>
				<button 
					className={ clsx( classes.addButton, { [ classes.disabledButton ]: !newStretch.name || !newStretch.frequency || useDefaultStretches }) }
					disabled={ !newStretch.name || !newStretch.frequency || useDefaultStretches }
					onClick={ () => {
						if ( newStretch.name && newStretch.frequency ) {
							dispatch({
								type: "updateStretchesMap",
								stretchesMap: _.concat( stretchesMap, newStretch ),
							});
							setNewStretch({ name: "", frequency: 1, bothSides: true });
						}
					}}
				>
						Add
				</button>
			</div>
		</div>
	);
}
Settings.propTypes = {
	state: PropTypes.object,
	dispatch: PropTypes.func,
};


// Toggle Component
const useToggleStyles = makeStyles({
	root: {
		display: "flex",
		alignItems: "center",
		opacity: ({ disabled }) => disabled ? 0.25 : 1,
	},
	label: {
		fontSize: "85%",
		padding: "0 1rem 0 0",
		margin: 0,
	},
	toggle: {
		borderStyle: "solid",
		borderColor: "var(--tertiary)",
		borderWidth: "1px",
		padding: "3px",
		cursor: "pointer",
		"& span": {
			opacity: ({ checked }) => checked ? 1 : 0,
			fontWeight: "bold",
		},
	},
});

const Toggle = ({ checked, onChange, label, disabled }) => {
	const classes = useToggleStyles({ checked, disabled });

	return (
		<span className={ classes.root }>
			{ label && <label className={ classes.label }>{ label }:</label>}
			<span className={ classes.toggle } onClick={ disabled ? null : onChange }>
				<span className="fa-check" />
			</span>
		</span>
	);
};
Toggle.propTypes = {
	label: PropTypes.string,
	checked: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};


// Input Text Component
const useInputTextStyles = makeStyles({
	root: {
		display: "flex",
		alignItems: "center",
		opacity: ({ disabled }) => disabled ? 0.25 : 1,
	},
	label: {
		fontSize: "85%",
		padding: "0 1rem 0 0",
		margin: 0,
	},
	input: {
		borderStyle: "solid",
		borderColor: "var(--tertiary)",
		borderWidth: "1px",
		padding: "2px",
		width: ({ isTypeNumber }) => isTypeNumber ? "3rem" : "8rem",
		"& :active, :hover, :focus": {
			backgroundColor: "var(--secondary)",
		},
		"& input": {
			border: "none",
		},
	},
});

const InputText = ({ value, onChange, label, disabled }) => {
	const isTypeNumber = typeof value === "number";
	const classes = useInputTextStyles({ isTypeNumber, disabled });

	return (
		<span className={ classes.root }>
			{ label && <label className={ classes.label }>{ label }:</label> }
			<input
				className={ classes.input }
				type={ isTypeNumber ? "number" : "text" } 
				value={ value } 
				disabled={ disabled }
				onChange={ disabled ? null : e => onChange( e.target.value ) } 
			/>
		</span>
	);
};
InputText.propTypes = {
	label: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};

// Guide 
const useGuideStyles = makeStyles({
	list: {
		"& li": {
			fontSize: "75%",
			width: "90%",
		},
	},
});
const Guide = () => {
	const classes = useGuideStyles();
	return (
		<div>
			<h5>Guide</h5>
			<ul className={ classes.list }>
				<li><b>Name:</b> The name which will show up for you in the queue.</li>
				<li><b>Frequency:</b> The number of times the stretch will repeat in the queue. If frequencies above 1 are used, then the higher frequency stretches will be added to the end in the same order as originally until the frequency has been hit.</li>
				<li><b>Both Sides:</b> A single entry or a single entry for each side of your body. Text will either: just be the name, or for both sided stretches, it will be &apos;Stretch Left/Right *name*&apos;.</li>
			</ul>
		</div> 	);
};

// Queue 
const useQueueStyles = makeStyles({
	list: {
		columnCount: ({ count }) => _.clamp( 1, _.ceil( count / 20 ), 3 ),
		columnGap: "1rem",
		"& li": {
			fontSize: "75%",
			width: "90%",
		},
	},
});
const Queue = ({ activitiesList }) => {
	const classes = useQueueStyles({ count: _.size( activitiesList ) });
	return ( 
		<div>
			<h5>Whole Stretching Loop</h5>
			<ol className={ classes.list }>
				{ !_.isEmpty( activitiesList ) && _.map( activitiesList, ({ key, label }) => <li key={ key }>{ label }</li> )}
			</ol>
		</div> 
	);
};
Queue.propTypes = {
	activitiesList: PropTypes.array,
};
