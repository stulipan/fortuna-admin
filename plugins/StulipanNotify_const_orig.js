
// export default {
const stulipanNotify_const_orig = {
  config: {
    position: 'bottom-center',
    isFluid: true,
    hasCloseButton: true,
    duration: 5000,

    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmBtnClass: 'btn btn-primary',
    cancelBtnClass: 'btn btn-secondary',
    messageClass: 'h4 mb-0',
  },

  notifications: [],
  container: null,

  confirmationTemplate : `
    <div class="confirmation">
      <div class="confirmation-dialog">
        <div class="confirmation-body {messageClass}">{message}</div>
        <div class="confirmation-footer">
          <button class="{cancelBtnClass} cancel">{cancelText}</button>
          <button class="{confirmBtnClass} confirm">{confirmText}</button>
        </div>
      </div>
    </div>
  `,

  configure(options) {
    Object.assign(this.config, options);
  },


  success(message, options = {}) {
    this.showNotification(message, 'success', options);
  },
  error(message, options = {}) {
    this.showNotification(message, 'danger', options);
  },
  warning(message, options = {}) {
    this.showNotification(message, 'warning', options);
  },
  info(message, options = {}) {
    this.showNotification(message, 'info', options);
  },
  confirmation(message, onConfirm, onCancel, options = {}) {
    this.showConfirmation(message, onConfirm, onCancel, options = {})
  },

  initNotifyContainer(position, isFluid = false) {
    let container = document.querySelector('[data-position="' + position + '"]');
    if (container) {
      return container;
    }

    container = document.createElement('div');
    container.classList.add('notify-container');
    if (isFluid) {
      container.classList.add('notify-fluid');
    }

    if (position === 'top-right') {
      container.setAttribute('data-position', 'top-right');
    }
    if (position === 'bottom-right') {
      container.setAttribute('data-position', 'bottom-right');
    }
    if (position === 'top-left') {
      container.setAttribute('data-position', 'top-left');
    }
    if (position === 'bottom-left') {
      container.setAttribute('data-position', 'bottom-left');
    }
    if (position === 'top-center') {
      container.setAttribute('data-position', 'top-center');
    }
    if (position === 'bottom-center') {
      container.setAttribute('data-position', 'bottom-center');
    }
    document.body.appendChild(container);
    return container;
  },
  showNotification(message, type = 'success', options = {}) {
    const mergedOptions = Object.assign({}, this.config, options);
    const { position, isFluid, hasCloseButton, duration } = mergedOptions;

    this.container = this.initNotifyContainer(position, isFluid);

    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notify', 'show', 'alert', `alert-${type}`, 'mb-0');

    // When at top, insert as FIRST element
    if (position.startsWith('top-')) {
      this.container.insertBefore(notificationDiv, this.container.firstChild);
    }

    // Insert as LAST element
    if (position.startsWith('bottom-')) {
      this.container.appendChild(notificationDiv);
    }


    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('notify-body');
    notificationDiv.appendChild(messageElement);

    const actionElement = document.createElement('div');
    actionElement.classList.add('notify-action');
    notificationDiv.appendChild(actionElement);

    if (hasCloseButton) {
      const closeButton = document.createElement('button');
      closeButton.classList.add('btn-close');

      closeButton.addEventListener('click', () => {
        // notificationDiv.classList.remove('show');
        this.removeFromList(notificationDiv);
      });
      actionElement.appendChild(closeButton);
    }

    this.notifications.push(notificationDiv);

    setTimeout(() => {
      this.removeFromList(notificationDiv)
    }, duration);
  },

  removeFromList(notificationDiv) {
    if (!document.body.contains(this.container)) return;

    if (document.body.contains(this.container)) {
      const index = this.notifications.indexOf(notificationDiv);
      if (index !== -1) {
        notificationDiv.classList.add('hide');

        // this event listener makes sure this code is executed only after `hide` class animation ends
        notificationDiv.addEventListener('animationend', () => {
          this.notifications.splice(index, 1);
          this.container.removeChild(notificationDiv);

          // if container is empty (doesn't hold any notifications), then remove it
          if (this.container.childNodes.length === 0) {
            document.body.removeChild(this.container);
          }
        });
      }
    }
  },

  showConfirmation(message, onConfirm, onCancel, options = {}) {
    return new Promise((resolve, reject) => {
      const mergedOptions = Object.assign({}, this.config, options);
      const { position, isFluid, hasCloseButton, duration } = mergedOptions;

      const confirmationTemplate = this.confirmationTemplate
        .replace('{message}', message)
        .replace('{cancelText}', mergedOptions.cancelText)
        .replace('{confirmText}', mergedOptions.confirmText)
        .replace('{cancelBtnClass}', mergedOptions.cancelBtnClass)
        .replace('{confirmBtnClass}', mergedOptions.confirmBtnClass)
        .replace('{messageClass}', mergedOptions.messageClass)
      ;

      const fragment = document.createDocumentFragment();

      // Create a temporary container div to hold the template, and to parse the template content
      const templateDiv = document.createElement('div');
      templateDiv.innerHTML = confirmationTemplate;

      // Append the children of tempDiv to the document fragment
      while (templateDiv.firstChild) {
        fragment.appendChild(templateDiv.firstChild);
      }

      document.body.appendChild(fragment);

      const confirmationDiv = document.body.querySelector('.confirmation');
      confirmationDiv.classList.add('show');

      const previouslyFocusedElement = document.activeElement;
      const focusableElements = confirmationDiv.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      function trapFocus(event) {
        if (event.key === 'Tab' || event.keyCode === 9) {
          if (event.shiftKey) {
            // Shift + Tab: navigate backwards
            if (document.activeElement === firstFocusableElement) {
              event.preventDefault();
              lastFocusableElement.focus();
            }
          } else {
            // Tab: navigate forwards
            if (document.activeElement === lastFocusableElement) {
              event.preventDefault();
              firstFocusableElement.focus();
            }
          }
        }
      }

      document.addEventListener('keydown', trapFocus);


      // const confirmationDiv = document.createElement('div');
      // confirmationDiv.innerHTML = confirmationTemplate;
      // document.body.appendChild(confirmationDiv);


      // const overlayDiv = document.createElement('div');
      // overlayDiv.classList.add('confirmation-backdrop');
      // document.body.appendChild(overlayDiv);

      const confirmButton = confirmationDiv.querySelector('.confirm');
      const cancelButton = confirmationDiv.querySelector('.cancel');
      confirmButton.focus();

      function closeConfirmation() {
        confirmationDiv.classList.remove('show');
        document.body.removeChild(confirmationDiv);

        document.removeEventListener('keydown', trapFocus);  // Remove the focus trap
        previouslyFocusedElement.focus();  // Give focus back

        // document.body.classList.remove('confirmation-backdrop');
        // document.body.removeChild(overlayDiv);
      }


      cancelButton.addEventListener('click', () => {
        closeConfirmation();
        if (onCancel && typeof onCancel === 'function') {
          onCancel();
        }
        resolve(false);
      });

      confirmButton.addEventListener('click', () => {
        closeConfirmation();
        if (onConfirm && typeof onConfirm === 'function') {
          onConfirm();
        }
        resolve(true);
      });

      confirmationDiv.addEventListener('click', (event) => {
        if (event.target === confirmationDiv) {
          closeConfirmation();
          resolve(false);
        }
      });

      confirmationDiv.addEventListener('keydown',  (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
          closeConfirmation();
          resolve(false);
        }
      });
    });
  },

  // showConfirmation(message, onConfirm, onCancel, options = {}) {
  //   const mergedOptions = Object.assign({}, this.config, options);
  //   const { position, isFluid, hasCloseButton, duration } = mergedOptions;
  //
  //   const notificationDiv = document.createElement('div');
  //
  //   notificationDiv.classList.add('confirmation', 'show');
  //
  //   const messageElement = document.createElement('div');
  //   messageElement.textContent = message;
  //   messageElement.classList.add('me-2');
  //   notificationDiv.appendChild(messageElement);
  //
  //   const cancelButton = document.createElement('button');
  //   cancelButton.textContent = 'Cancel';
  //   cancelButton.classList.add('btn', 'btn-secondary');
  //   cancelButton.addEventListener('click', () => {
  //     notificationDiv.classList.remove('show');
  //     this.removeFromList(notificationDiv);
  //     if (onCancel && typeof onCancel === 'function') {
  //       onCancel();
  //     }
  //   });
  //   notificationDiv.appendChild(cancelButton);
  //
  //   const confirmButton = document.createElement('button');
  //   confirmButton.textContent = 'OK';
  //   confirmButton.classList.add('btn', 'btn-primary', 'me-2');
  //   confirmButton.addEventListener('click', () => {
  //     notificationDiv.classList.remove('show');
  //     this.removeFromList(notificationDiv);
  //     if (onConfirm && typeof onConfirm === 'function') {
  //       onConfirm();
  //     }
  //   });
  //   notificationDiv.appendChild(confirmButton);
  //
  //   document.body.appendChild(notificationDiv);
  // },
};

export default stulipanNotify_const_orig;
