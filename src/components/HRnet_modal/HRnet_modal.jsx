import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./hrnet_modal.module.scss";
/**
 * Reusable modal component for confirmation dialogs, alerts, forms or custom content.
 *
 * The component supports:
 * - conditional rendering through `isOpen`
 * - closing with the Escape key
 * - closing by clicking on the overlay
 * - optional close icon
 * - optional cancel and confirm actions
 * - custom icons for buttons
 * - custom children content
 * - inline customization for size, colors, typography and shadow
 *
 * @component
 *
 * @param {Object} props - Component props.
 *
 * @param {boolean} props.isOpen - Determines whether the modal is rendered.
 *
 * @param {string} [props.overlayClassName=""] - Additional CSS class applied to the overlay.
 * @param {string|number} [props.width="520px"] - Width of the modal container.
 * @param {string|number} [props.maxHeight="85vh"] - Maximum height of the modal container.
 * @param {string|number} [props.borderRadius="20px"] - Border radius of the modal container.
 *
 * @param {string} [props.title="Confirmation"] - Modal title displayed in the heading.
 * @param {string} [props.message=""] - Optional message displayed below the title.
 * @param {React.ReactNode} [props.children] - Custom content rendered inside the modal body.
 *
 * @param {Function} [props.onCancel] - Callback executed when the cancel button is clicked.
 * @param {Function} [props.onConfirm] - Callback executed when the confirm button is clicked.
 * @param {Function} props.onClose - Callback used to close the modal.
 *
 * @param {boolean} [props.showCloseIcon=false] - Displays the close button when true.
 * @param {string} [props.closeButtonClassName=""] - Additional CSS class applied to the close button.
 * @param {React.ReactNode} [props.closeIcon=null] - Custom icon displayed inside the close button.
 *
 * @param {boolean} [props.showCancelButton=false] - Displays the cancel button when true.
 * @param {boolean} [props.showConfirmButton=false] - Displays the confirm button when true.
 *
 * @param {React.ReactNode} [props.cancelIcon=null] - Optional icon displayed before the cancel button text.
 * @param {React.ReactNode} [props.confirmIcon=null] - Optional icon displayed before the confirm button text.
 *
 * @param {string} [props.cancelText="Cancel"] - Text displayed inside the cancel button.
 * @param {string} [props.confirmText="Confirm"] - Text displayed inside the confirm button.
 * @param {"button"|"submit"|"reset"} [props.confirmButtonType="button"] - Native HTML type of the confirm button.
 *
 * @param {string|number} [props.fontSize="1rem"] - Font size applied to the modal container.
 * @param {string} [props.backgroundColor="#ffffff"] - Background color of the modal container.
 * @param {string} [props.textColor="#111827"] - Main text color of the modal.
 * @param {string} [props.titleColor="#111827"] - Color applied to the title.
 * @param {string} [props.overlayColor="rgba(0, 0, 0, 0.55)"] - Background color of the overlay.
 *
 * @param {string} [props.confirmButtonColor="#2563eb"] - Background color of the confirm button.
 * @param {string} [props.cancelButtonColor="#e5e7eb"] - Background color of the cancel button.
 * @param {string} [props.confirmButtonTextColor="#ffffff"] - Text color of the confirm button.
 * @param {string} [props.cancelButtonTextColor="#111827"] - Text color of the cancel button.
 *
 * @param {string} [props.boxShadow="0 12px 40px rgba(0, 0, 0, 0.2)"] - Box shadow applied to the modal container.
 * @param {string} [props.fontFamily="inherit"] - Font family used inside the modal.
 *
 * @param {string} [props.className=""] - Additional CSS class applied to the modal container.
 * @param {string} [props.bodyClassName=""] - Additional CSS class applied to the modal body.
 * @param {string} [props.confirmButtonClassName=""] - Additional CSS class applied to the confirm button.
 * @param {string} [props.cancelButtonClassName=""] - Additional CSS class applied to the cancel button.
 *
 * @returns {JSX.Element|null} The modal element when open, otherwise `null`.
 */

function HRnet_modal({
  isOpen,

  overlayColor = "rgba(0, 0, 0, 0.55)",
  overlayClassName = "",
  className = "",
  width = "520px",
  maxHeight = "85vh",
  borderRadius = "20px",
  fontSize = "1rem",
  backgroundColor = "#ffffff",

  boxShadow = "0 12px 40px rgba(0, 0, 0, 0.2)",
  fontFamily = "inherit",
  bodyClassName = "",

  title = "Confirmation",
  titleColor = "#111827",
  message = "",
  textColor = "#111827",
  children,

  onCancel,
  onConfirm,
  onClose,

  showCloseIcon = false,
  closeButtonClassName = "",
  closeIcon = null,

  showCancelButton = false,
  cancelIcon = null,
  cancelText = "Cancel",
  cancelButtonColor = "#e5e7eb",
  cancelButtonTextColor = "#111827",
  cancelButtonClassName = "",

  showConfirmButton = false,
  confirmIcon = null,
  confirmText = "Confirm",
  confirmButtonColor = "#2563eb",
  confirmButtonTextColor = "#ffffff",
  confirmButtonClassName = "",

  confirmButtonType = "button",
}) {
  /**
   * Handles side effects when modal opens:
   * - locks page scroll
   * - closes modal with Escape key
   * - restores scroll on unmount
   */
  useEffect(() => {
    if (!isOpen) return;

    // Save previous body overflow value
    const previousOverflow = document.body.style.overflow;

    /**
     * Close modal when Escape key is pressed
     */
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    // Add keyboard listener
    document.addEventListener("keydown", handleEscape);

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    // Cleanup when modal closes
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  /**
   * If modal is closed, render nothing.
   */
  if (!isOpen) return null;

  /**
   * Close modal only when clicking on overlay,
   * not inside modal content.
   */
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  /**
   * Handles cancel action:
   * - execute optional callback
   * - close modal
   */
  function handleCancel() {
    onCancel?.();
    onClose();
  }

  /**
   * Handles confirm action.
   *
   * If button type = submit,
   * form submission is handled externally.
   */
  function handleConfirm() {
    if (confirmButtonType === "button") {
      onConfirm?.();
      onClose();
    }
  }

  return (
    /**
     * Overlay background
     */
    <div
      className={`${styles.modal__overlay} ${overlayClassName}`}
      style={{ backgroundColor: overlayColor }}
      onClick={handleOverlayClick}
    >
      {/* Main modal container */}
      <div
        className={`${styles.modal__container} ${className}`}
        style={{
          width,
          maxHeight,
          fontSize,
          backgroundColor,
          color: textColor,
          borderRadius,
          boxShadow,
          fontFamily,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={message ? "modal-message" : undefined}
      >
        {/* Optional close button */}
        {showCloseIcon && (
          <button
            type="button"
            className={`${styles.modal__close} ${closeButtonClassName}`}
            onClick={onClose}
            aria-label="Close modal"
            style={{ color: textColor }}
          >
            {closeIcon || "×"}
          </button>
        )}

        {/* Modal content */}
        <div className={styles.modal__content}>
          {/* Title */}
          <h2
            id="modal-title"
            className={styles.modal__title}
            style={{ color: titleColor }}
          >
            {title}
          </h2>

          {/* Optional message */}
          {message && (
            <p id="modal-message" className={styles.modal__message}>
              {message}
            </p>
          )}

          {/* Custom body */}
          {children && (
            <div className={`${styles.modal__body} ${bodyClassName}`}>
              {children}
            </div>
          )}

          {/* Action buttons */}
          {(showCancelButton || showConfirmButton) && (
            <div className={styles.modal__actions}>
              {/* Cancel button */}
              {showCancelButton && (
                <button
                  type="button"
                  className={`${styles.modal__button} ${styles.modal__button_cancel} ${cancelButtonClassName}`}
                  onClick={handleCancel}
                  style={{
                    backgroundColor: cancelButtonColor,
                    color: cancelButtonTextColor,
                  }}
                >
                  {cancelIcon && (
                    <span className={styles.modal__buttonIcon}>
                      {cancelIcon}
                    </span>
                  )}
                  {cancelText}
                </button>
              )}

              {/* Confirm button */}
              {showConfirmButton && (
                <button
                  type={confirmButtonType}
                  className={`${styles.modal__button} ${styles.modal__button_confirm} ${confirmButtonClassName}`}
                  onClick={handleConfirm}
                  style={{
                    backgroundColor: confirmButtonColor,
                    color: confirmButtonTextColor,
                  }}
                >
                  {confirmIcon && (
                    <span className={styles.modal__buttonIcon}>
                      {confirmIcon}
                    </span>
                  )}
                  {confirmText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Runtime validation of props.
 */
HRnet_modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,

  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,

  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,

  showCloseIcon: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,

  closeIcon: PropTypes.node,
  cancelIcon: PropTypes.node,
  confirmIcon: PropTypes.node,

  cancelText: PropTypes.string,
  confirmText: PropTypes.string,

  confirmButtonType: PropTypes.oneOf(["button", "submit", "reset"]),

  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  titleColor: PropTypes.string,
  overlayColor: PropTypes.string,

  confirmButtonColor: PropTypes.string,
  cancelButtonColor: PropTypes.string,

  confirmButtonTextColor: PropTypes.string,
  cancelButtonTextColor: PropTypes.string,

  boxShadow: PropTypes.string,
  fontFamily: PropTypes.string,

  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  closeButtonClassName: PropTypes.string,
  confirmButtonClassName: PropTypes.string,
  cancelButtonClassName: PropTypes.string,
};

export default HRnet_modal;
