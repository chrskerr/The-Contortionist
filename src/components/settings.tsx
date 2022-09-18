
// dev
import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Popover, useMediaQuery } from "@material-ui/core";
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
		paddingTop: "0.5rem",
		paddingBottom: "0.5rem",
		flexWrap: "wrap",
		"& > *": {
			margin: "0 0.5rem 0 0.5rem", padding: 0,
		},
	},
	stretchMapInput: {
		display: "flex",
		alignItems: "center",
		paddingTop: "0.5rem",
		paddingBottom: "0.5rem",
		flexWrap: "wrap",
		justifyContent: ({ isBig }) => isBig ? "space-betweem" : "flex-start",
		"& > *": {
			margin: "0.2rem 0.5rem", padding: 0,
		},
	},
	borderBottom: {
		borderBottom: "1px dashed lightgrey",
	},
	button: {
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
	deleteButton: {
		background: "var(--highlight)",
		width: "60px",
	},
	addButton: {
		background: "var(--secondary)",
		width: "60px",
	},
	upDownButton: {
		background: "white",
		display: "inline-block",
		padding: 0,
		margin: "0.25rem",
		border: "1px inset var(--paragraph)",
	},
	hidden: {
		opacity: 0,
		cursor: "default",
	},
	disabledButton: {
		opacity: 0.25,
		cursor: "not-allowed",
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
	const { duration, useDefaultStretches, stretchesMap } = state;

	const isBig = useMediaQuery( "(min-width:893px)" );
	const classes = useStyles({ isBig });

	const [ anchorEl, setAnchorEl ] = useState( false );
	const [ newStretch, setNewStretch ] = useState({ name: "", frequency: 1, bothSides: true });


	return (
		<div className={ classes.root }>
			<div className={ classes.header }>
				<h4>Settings:</h4>
				<div>
					<button onClick={ e => setAnchorEl( e.currentTarget ) } aria-label="open guide">Guide</button>
				</div>
			</div>
			<Popover
				className={ classes.popover }
				open={ Boolean( anchorEl )}
				anchorEl={ anchorEl }
				onClose={ () => setAnchorEl( false ) }
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				BackdropProps={{ invisible: false }}
			>
				<Guide />
			</Popover>
			<div className={ classes.input }>
				<h5>Duration:</h5>
				<InputText 
					value={ duration }
					wide
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
			{ !_.isEmpty( stretchesMap ) && _.map( _.concat( stretchesMap, newStretch ), ( stretch, i ) => {
				const isFirstStretch = i === 0;
				const isLastExistingStretch = i === _.size( stretchesMap ) - 1;
				const isNewStretch = i === _.size( stretchesMap );

				return (
					<div className={ clsx( classes.stretchMapInput, classes.borderBottom ) } key={ i }>
						<InputText
							disabled={ useDefaultStretches }
							label="Name"
							value={ _.get( stretch, "name" ) }
							onChange={ name => isNewStretch ?
								setNewStretch( ns => ({ ...ns, name })) :
								dispatch({ 
									type: "updateStretchesMap", 
									stretchesMap: _.map( stretchesMap, ( el, j ) => i != j ? el : { ...el, name }), 
								})} 
						/>
						<InputText 
							disabled={ useDefaultStretches }
							label="Frequency"
							value={ _.get( stretch, "frequency" ) }
							onChange={ frequency => isNewStretch ? 
								setNewStretch( ns => ({ ...ns, frequency: Number( frequency ) })) : 
								dispatch({ 
									type: "updateStretchesMap", 
									stretchesMap: _.map( stretchesMap, ( el, j ) => i != j ? el : { ...el, frequency: Number( frequency ) }), 
								})} 
						/>
						<Toggle 
							disabled={ useDefaultStretches }
							label="Both Sides"
							checked={ _.get( stretch, "bothSides" )}
							onChange={ () => isNewStretch ? 
								setNewStretch( ns => ({ ...ns, bothSides: !ns.bothSides })) : 
								dispatch({ 
									type: "updateStretchesMap", 
									stretchesMap: _.map( stretchesMap, ( el, j ) => i != j ? el : { ...el, bothSides: !_.get( stretch, "bothSides" ) }), 
								})}
						/>
						{ isNewStretch ? 
							<button 
								className={ clsx( classes.button, classes.addButton, { [ classes.disabledButton ]: !newStretch.name || !newStretch.frequency || useDefaultStretches }) }
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
								aria-label="add new stretch to queue"
							>
											Add
							</button>
							: 
							<button 
								disabled={ useDefaultStretches }
								className={ clsx( classes.button, classes.deleteButton, { [ classes.disabledButton ]: useDefaultStretches }) }
								onClick={ () => { 
									if ( !useDefaultStretches ) { 
										dispatch({
											type: "updateStretchesMap",
											stretchesMap: _.reject( stretchesMap, ( el, j ) => i === j ),
										});
									}
								}}
								aria-label="delete stretch from queue"
							>
							Delete
							</button>
						}
						<div>
							<button
								className={ clsx( 
									classes.button, 
									classes.upDownButton, 
									{ 
										[ classes.disabledButton ]: useDefaultStretches || isFirstStretch,
										[ classes.hidden ]: isNewStretch,
									},
								) }
								disabled={ isFirstStretch }
								onClick={ () => {
									if ( !useDefaultStretches && !isFirstStretch && !isNewStretch ) {
										dispatch({
											type: "updateStretchesMap",
											stretchesMap: _.reduce( stretchesMap, ( acc, el, j ) => {
												if ( j === i ) return acc;
												else if ( j === i - 1 ) return _.concat( acc, stretch, el );
												else return _.concat( acc, el );
											},[]),
										});
									}
								}}
								aria-label="move stretch earlier in queue"
							>
								<span className="fa-chevron-up" />
							</button>
							<button
								className={ clsx( 
									classes.button, 
									classes.upDownButton, 
									{ 
										[ classes.disabledButton ]: useDefaultStretches || isLastExistingStretch,
										[ classes.hidden ]: isNewStretch, 
									},
								) }
								disabled={ isLastExistingStretch }
								onClick={ () => {
									if ( !useDefaultStretches && !isLastExistingStretch && !isNewStretch ) {
										dispatch({
											type: "updateStretchesMap",
											stretchesMap: _.reduce( stretchesMap, ( acc, el, j ) => {
												if ( j === i ) return acc;
												else if ( j === i + 1 ) return _.concat( acc, el, stretch );
												else return _.concat( acc, el );
											},[]),
										});
									}
								}}
								aria-label="move stretch later in queue"
							>
								<span className="fa-chevron-down" />
							</button>
						</div>
					</div>
				);
			})}
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
		width: ({ isTypeNumber, wide }) => isTypeNumber ? 
			wide ? "4rem" : "2rem" : 
			wide ? "12rem" : "7rem",
		"& :active, :hover, :focus": {
			backgroundColor: "var(--secondary)",
		},
		"& input": {
			border: "none",
		},
	},
});

const InputText = ({ value, onChange, label, disabled, wide }) => {
	const isTypeNumber = typeof value === "number";
	const classes = useInputTextStyles({ isTypeNumber, wide, disabled });

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
	wide: PropTypes.bool,
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
