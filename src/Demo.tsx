import React from 'react';
import { Slider } from './Slider';

import styles from './Demo.module.css';

export const Demo = () => {
	return (
		<div className={styles.root}>
			<div className={styles.container}>
				<Slider />
			</div>
		</div>
	);
};
