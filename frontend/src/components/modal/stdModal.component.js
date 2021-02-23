import React, {
  Component,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { IoCloseOutline } from 'react-icons/io5';
import { Button } from 'react-bootstrap';
import styles from './styles.modal.module.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({ open: true });
  }

  close() {
    this.setState({ open: false });
  }

  render() {
    return (
      <AnimatePresence>
        {this.state.open && (
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
            onClick={() => {}}
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
            <div className={styles.closeButtonDiv}>
              <Button
                variant="custom"
                role="button"
                onClick={this.close}
              >
                {' '}
                <IoCloseOutline size={25} />
              </Button>
            </div>
            <div className={styles.modalPadding}>
              {this.props.children}
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.element,
};
Modal.defaultProps = {
  children: <div />,
};

export default Modal;
