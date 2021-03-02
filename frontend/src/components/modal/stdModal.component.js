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
            onClick={() => { this.close(); }}
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
            style={this.props.contentStyle}
          >
            {!this.props.headerDisabled
              ? (
                <div className={styles.headerContainer}>
                  <div className={styles.headerStyle}>
                    {this.props.header}
                  </div>
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
                </div>
              ) : null }
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
  header: PropTypes.element,
  headerDisabled: PropTypes.bool,
};
Modal.defaultProps = {
  children: <div />,
  header: <div />,
  headerDisabled: false,
};

export default Modal;
