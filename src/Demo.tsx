import React, { useCallback, useState } from 'react';
import { Slider, sliderConfig } from './Slider';

import styles from './Demo.module.css';
import { motion, Transition, useAnimation, Variants } from 'framer-motion';

const baseHandleTransition: Transition = {
	restDelta: 0,
};

const curtainVariants: Record<string, Variants> = {
	left: {
		hidden: {
			x: '-100vw',
		},
		visible: {
			x: '-50vw',
		},
	},
	right: {
		hidden: {
			x: '100vw',
		},
		visible: {
			x: '50vw',
		},
	},
};

export const Demo = () => {
	const curtainControls = useAnimation();

	const handleDrag = useCallback((value, max) => {}, []);

	const handleDragEnd = useCallback(
		({ controls, dropRatio, info, maxPosition }: Slider.DragEndPayload) => {
			if (dropRatio > sliderConfig.snapHandleToEndRatio) {
				controls
					.start({
						x: maxPosition,
						transition: baseHandleTransition,
					})
					.then(() => {
						curtainControls.start('visible', {
							delay: 0.5,
							restDelta: 0,
						});
					});
			} else {
				controls.start({
					x: 0,
					transition: baseHandleTransition,
				});
			}
		},
		[],
	);

	const handleDragStart = useCallback(() => {}, []);

	return (
		<div className={styles.root}>
			<motion.div
				initial="hidden"
				variants={curtainVariants.left}
				animate={curtainControls}
				className={styles.leftCurtain}
			/>
			<motion.div
				initial="hidden"
				variants={curtainVariants.right}
				animate={curtainControls}
				className={styles.rightCurtain}
			/>
			<div className={styles.container}>
				<Slider
					onSlideChange={handleDrag}
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
				/>
			</div>
		</div>
	);
};
