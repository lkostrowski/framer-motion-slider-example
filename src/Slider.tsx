import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { ReactComponent as ShutDownIcon } from './shut-down.svg';

import styles from './Slider.module.css';

const config = {
	railHeight: 62,
	thumbSize: 56,
	defaultRailWidth: 274,
};

export const Slider = ({
	className,
	onSlideChange,
	onDragEnd,
	onDragStart,
	...props
}: {
	onSlideChange?(value: number, max: number): void;
	onDragStart?(): void;
	onDragEnd?(info: PanInfo, finish: boolean): void;
	className?: string;
}) => {
	const railRef = useRef<null | HTMLDivElement>(null);

	const controls = useAnimation();
	const xPosition = useMotionValue(0);

	const getRailWidth = () =>
		railRef.current?.getBoundingClientRect().width || config.defaultRailWidth;

	useEffect(() => {
		if (!railRef.current || !onSlideChange) {
			return;
		}

		xPosition.onChange((value) => {
			onSlideChange(value, getRailWidth() - config.thumbSize);
		});

		return () => {
			xPosition.clearListeners();
		};
	}, [xPosition, onSlideChange, railRef.current]);

	const labelOpacity = useTransform(xPosition, [0, 30, 130, 200], [1, 0, 0, 1]);

	const labelPosition = useTransform(xPosition, [100, getRailWidth()], [0, -70]);

	const handleDragEnd = useCallback(
		(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			const dropPosition = xPosition.get();

			if (dropPosition > getRailWidth() * 0.7) {
				controls
					.start({
						x: getRailWidth() - config.thumbSize,
						transition: {
							restDelta: 0,
						},
					})
					.then(() => {
						onDragEnd && onDragEnd(info, true);
					});
			} else {
				controls
					.start({
						x: 0,
						transition: {
							restDelta: 0,
						},
					})
					.then(() => {
						onDragEnd && onDragEnd(info, false);
					});
			}
		},
		[controls, onDragEnd],
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
						<ShutDownIcon className={styles.icon} />
					</motion.div>
					<motion.span style={{ opacity: labelOpacity, x: labelPosition }} className={styles.label}>
						Slide to shut down
					</motion.span>
				</div>
			</div>
		</motion.div>
	);
};
