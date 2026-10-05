export default class StulipanModal {
  body
  modal
  closeButtons
  backdrop
  previouslyFocusedElement
  firstFocusableElement
  lastFocusableElement
  isOpen = false;
  isSidebar = false;

  constructor(options) {
    this.config = {
      target: '.modal',
      closeOnEsc: true,
      hasBackdrop: true, // for Sidebar
    };
    Object.assign(this.config, options);
    const { target, closeOnEsc, hasBackdrop } = this.config;

    this.modal = document.querySelector(this.config.target);
    this.modalDialog = this.modal.querySelector('[data-modal-dialog]');

    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('modal-backdrop', 'hide');

    this.isSidebar = this.modal.classList.contains('sidebar');
    this.config.closeOnEsc = !this.isSidebar; // false


    this.closeButtons = this.modal.querySelectorAll('[data-close-modal]');
    if (this.closeButtons.length > 0) {
      this.closeButtons.forEach(button => {
        button.addEventListener('click', this.hide.bind(this));
      });
      this.closeButtons[0].focus();
    }

    // Close the modal when a link is clicked, which supposedly will navigate off the page
    const links = this.modal.querySelectorAll('a[href]:not([href="#"])');
    if (links.length > 0) {
      links.forEach(link => {
        link.addEventListener('click', this.hide.bind(this));
      });
    }


    // Trap focus
    this.previouslyFocusedElement = document.activeElement;
    const focusableElements = this.modal.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    this.firstFocusableElement = focusableElements[0];
    this.lastFocusableElement = focusableElements[focusableElements.length - 1];

    document.addEventListener('keydown', this.trapFocus.bind(this));

    if (closeOnEsc) {
      this.modal.addEventListener('click', (event) => {
        if (event.target === this.modal) {
          this.hide();
        }
      });

      this.modal.addEventListener('keydown',  (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
          this.hide();
        }
      });
    }

    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  configure(options) {
    Object.assign(this.config, options);
  }

  show() {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    this.modal.classList.remove('hide');
    this.modal.style.display = 'block';
    this.modal.classList.add('show');
    this.modal.setAttribute('aria-hidden', 'false');

    this.addBackdrop();
    this.modalDialog.focus();


    const handleShowAnimation = (event) => {
      if (event.target === this.modal || this.modal.contains(event.target)) {
        this.modal.removeEventListener('animationend', handleShowAnimation);

        this.isOpen = true;
      }
    }
    this.modal.addEventListener('animationend', handleShowAnimation);
  }

  hide() {
    this.modal.classList.remove('show');
    this.modal.classList.add('hide');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    // this.backdrop.classList.remove('show');
    this.removeBackdrop();

    //
    const handleAnimationEnd = (event) => {
      if (event.target === this.modal || this.modal.contains(event.target)) {
        this.modal.removeEventListener('animationend', handleAnimationEnd);

        document.removeEventListener('keydown', this.trapFocus);
        this.previouslyFocusedElement.focus();

        this.modal.style.display = 'none';
        this.modal.setAttribute('aria-hidden', 'true');
        this.isOpen = false;
      }
    };
    this.modal.addEventListener('animationend', handleAnimationEnd);
  }

  addBackdrop() {
    document.body.appendChild(this.backdrop);
    this.backdrop.classList.add('show');
  }
  removeBackdrop() {
    this.backdrop.classList.remove('show');
    this.backdrop.addEventListener('transitionend', (event) => {
      document.body.removeChild(this.backdrop);
    })
  }

  handleBeforeUnload() {
    this.hide()
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  trapFocus(event) {
    if (event.key === 'Tab' || event.keyCode === 9) {
      if (event.shiftKey) {
        // Shift + Tab: navigate backwards
        if (document.activeElement === this.firstFocusableElement) {
          event.preventDefault();
          this.lastFocusableElement.focus();
        }
      } else {
        // Tab: navigate forwards
        if (document.activeElement === this.lastFocusableElement) {
          event.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    }
  }

  hasTransition(element) {
    const computedStyle = getComputedStyle(element);
    return computedStyle.transition !== 'none' && computedStyle.transition !== '';
  }
}

// function initButtonListeners() {
//   if (typeof document !== 'undefined') {
//     const buttons = document.querySelectorAll('[data-open-modal]');
//
//     buttons.forEach((button) => {
//       const targetModalId = button.getAttribute('data-open-modal');
//       const modal = document.getElementById(targetModalId);
//
//       if (modal) {
//         button.addEventListener('click', () => {
//           const modalInstance = new StulipanModal({
//             target: `#${targetModalId}`,
//           });
//           modalInstance.configure({closeOnEsc: true});
//           modalInstance.show();
//         });
//       }
//     });
//   }
// }
//
// if (typeof document !== 'undefined') {
//   document.addEventListener('DOMContentLoaded', initButtonListeners);
// }

const StulipanModalInit = {
  initialize(modalId) {
    this.initButtonListeners(modalId)
  },
  initButtonListeners(modalId) {
    if (typeof document !== 'undefined') {

      let buttons = null;
      if (typeof modalId !== 'undefined') {
        buttons = document.querySelectorAll(`[data-open-modal="${modalId}"]`);
      } else {
        buttons = document.querySelectorAll('[data-open-modal]');
      }
      if (buttons.length === 0) return;

      buttons.forEach((button) => {
        const targetModalId = button.getAttribute('data-open-modal');
        const modal = document.getElementById(targetModalId);

        if (targetModalId === modal.id) {
          button.addEventListener('click', () => {
            const modalInstance = new StulipanModal({
              target: `#${targetModalId}`,
            });
            // console.log('new StulipanModal');
            modalInstance.configure({closeOnEsc: true});
            modalInstance.show();
          });
        }
      });
    }
  },
}

export { StulipanModalInit }
