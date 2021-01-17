import {
	AnimatePresence,
	AnimationControls,
	motion,
	PanInfo,
	useAnimation,
	useMotionValue,
	useTransform,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './Slider.module.css';

export const sliderConfig = {
	railHeight: 62,
	thumbSize: 56,
	defaultRailWidth: 274,
	snapHandleToEndRatio: 0.6,
	labelOpacity: {
		outputRange: [1, 0, 0, 1],
	},
	labelPosition: {
		inputStart: 100,
		outputRange: [0, -70],
	},
};

export declare namespace Slider {
	export type DragEndPayload = {
		info: PanInfo;
		maxPosition: number;
		dropRatio: number;
		controls: AnimationControls;
	};

	export type Props = {
		onSlideChange?(value: number, max: number): void;
		onDragStart?(): void;
		onDragEnd?(opts: DragEndPayload): void;
		className?: string;
	};
}

export const Slider = ({
	className,
	onSlideChange,
	onDragEnd,
	onDragStart,
	...props
}: Slider.Props) => {
	const railRef = useRef<null | HTMLDivElement>(null);
	const [switched, setSwitched] = useState(false);

	const controls = useAnimation();
	const xPosition = useMotionValue(0);

	const getRailWidth = () =>
		railRef.current?.getBoundingClientRect().width || sliderConfig.defaultRailWidth;

	/**
	 * Update parent component about position change
	 */
	useEffect(() => {
		if (!railRef.current) {
			return;
		}

		xPosition.onChange((value) => {
			if (value > getRailWidth() * sliderConfig.snapHandleToEndRatio) {
				setSwitched(true);
			} else {
				setSwitched(false);
			}

			onSlideChange && onSlideChange(value, getRailWidth() - sliderConfig.thumbSize);
		});

		return () => {
			xPosition.clearListeners();
		};
	}, [xPosition, onSlideChange, railRef]);

	const labelOpacity = useTransform(
		xPosition,
		[
			0,
			30,
			getRailWidth() * sliderConfig.snapHandleToEndRatio,
			getRailWidth() * sliderConfig.snapHandleToEndRatio + 10,
		],
		sliderConfig.labelOpacity.outputRange,
	);

	const labelPosition = useTransform(
		xPosition,
		[sliderConfig.labelPosition.inputStart, getRailWidth()],
		sliderConfig.labelPosition.outputRange,
	);

	const handleDragEnd = useCallback(
		(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			const dropPosition = xPosition.get();
			const railWidth = getRailWidth();
			const dropRatio = xPosition.get() / railWidth;

			onDragEnd &&
				onDragEnd({
					dropRatio: dropRatio,
					controls: controls,
					info: info,
					maxPosition: railWidth - sliderConfig.thumbSize,
				});
		},
		[controls, onDragEnd, xPosition],
	);

	return (
		<motion.div className={className} {...props}>
			<div className={styles.rail}>
				<div className={styles.railWrapper} ref={railRef}>
					<motion.div
						onDragStart={onDragStart}
						dragElastic={false}
						dragConstraints={railRef}
						className={styles.iconWrapper}
						drag="x"
						dragMomentum={false}
						onDragEnd={handleDragEnd}
						animate={controls}
						style={{ x: xPosition }}
					>
						<motion.svg
							className={styles.icon}
							viewBox="0 0 18 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5 2C2.60879 3.38324 1 5.96861 1 8.92974C1 13.348 4.58172 16.9297 9 16.9297C13.4183 16.9297 17 13.348 17 8.92974C17 5.96861 15.3912 3.38324 13 2"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M9 9.00005V0.800049"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</motion.svg>
					</motion.div>
					<motion.span style={{ opacity: labelOpacity, x: labelPosition }} className={styles.label}>
						{switched ? <span>Release to shut down</span> : <span>Slide to shut down</span>}
					</motion.span>
				</div>
			</div>
		</motion.div>
	);
};
