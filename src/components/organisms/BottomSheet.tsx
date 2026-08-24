import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useAnimation } from 'motion/react';
import React from 'react';
import { cssMotionTransition } from '../../theme/motion';

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Family-drawer-style bottom sheet (animations.dev / Vaul lineage):
 * - enters on the iOS sheet curve via the motion.entrance role (500ms,
 *   cubic-bezier(0.32, 0.72, 0, 1)); exits faster (motion.exit)
 * - drag-to-dismiss with damped upward overdrag; releases past a distance
 *   or velocity threshold dismiss, otherwise it springs back
 * - transform/opacity only — no layout-triggering properties
 */
export function BottomSheet({ open, onOpenChange, title, children }: BottomSheetProps) {
  const enter = cssMotionTransition('entrance');
  const exitT = cssMotionTransition('exit');
  const controls = useAnimation();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="ev-bottom-sheet__overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: exitT }}
                transition={enter}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="ev-bottom-sheet"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%', transition: exitT }}
                transition={enter}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.06, bottom: 0.9 }}
                onDragEnd={(_e, info) => {
                  if (info.offset.y > 120 || info.velocity.y > 500) {
                    onOpenChange(false);
                  } else {
                    controls.start({ y: 0 });
                  }
                }}
              >
                <div className="ev-bottom-sheet__handle" aria-hidden />
                {title && (
                  <Dialog.Title className="ev-bottom-sheet__title">
                    {title}
                  </Dialog.Title>
                )}
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/**
 * The Family morph: crossfades between views while animating the sheet's
 * content height. Views blur/scale slightly during the swap (motion.swap
 * role timing).
 */
export function BottomSheetViews({
  view,
  views,
}: {
  view: string;
  views: Record<string, React.ReactNode>;
}) {
  const swap = cssMotionTransition('swap');
  const [height, setHeight] = React.useState<number | 'auto'>('auto');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [view]);

  return (
    <motion.div
      className="ev-bottom-sheet__views"
      animate={{ height }}
      transition={swap}
    >
      <div ref={ref}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)', transition: swap }}
            transition={swap}
          >
            {views[view]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
