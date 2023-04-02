// dev
import React, { useState } from 'react';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';

//
// Add To Home
//

const useStyles = makeStyles({
	paper: {
		width: '85vw',
		'& p': {
			padding: '0 1.5rem',
		},
	},
});

export default function AddToHomeIos() {
	const classes = useStyles();

	const [open, setOpen] = useState(
		_.includes(_.toLower(window.navigator.userAgent), 'iphone') &&
			!_.get(window, 'navigator.standalone'),
	);

	return (
		<Popover
			classes={{
				root: classes.popover,
				paper: classes.paper,
			}}
			open={open}
			anchorReference="anchorPosition"
			anchorPosition={{
				top: window.innerHeight,
				left: window.innerWidth / 2,
			}}
			onClose={() => setOpen(false)}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			BackdropProps={{ invisible: false }}
		>
			<p>
				You can install this web-app onto your phone. Tap{' '}
				<span className="fa-ios_share" /> below, and then press
				&apos;Add to Home Screen&apos;.
			</p>
		</Popover>
	);
}
