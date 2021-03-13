import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from './styles.modal.module.css';

const Modal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.2,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.3,
              },
            }}
            onClick={() => setOpen(false)}
            className={styles.modalBackdrop}
          />
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.2,
              },
            }}
            exit={{
              scale: 0,
              transition: {
                delay: 0.2,
              },
            }}
            className={styles.modalContentWrapper}
          >
            {props.children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

Modal.propTypes = {
  children: PropTypes.element,
};
Modal.defaultProps = {
  children: <div />,
};

export default Modal;
