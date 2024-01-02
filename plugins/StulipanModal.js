export default class StulipanModal {
  body
  modal
  closeButtons
  previouslyFocusedElement
  firstFocusableElement
  lastFocusableElement
  isOpen = false;

  constructor(options) {
    this.config = {
      target: '.modal',
      closeOnEsc: true,
      hasBackdrop: true, // for Sidebar
    };
    Object.assign(this.config, options);
    const { target, closeOnEsc, hasBackdrop } = this.config;

    this.modal = document.querySelector(this.config.target);
    this.modalDialog = this.modal.querySelector('.modal-dialog');

    this.closeButtons = this.modal.querySelectorAll('[data-close-modal]');
    if (this.closeButtons.length > 0) {
      this.closeButtons.forEach(button => {
        button.addEventListener('click', this.hide.bind(this));
      });
      this.closeButtons[0].focus();
    }

    // this.btnClose = this.modal.querySelector('[data-close-modal]');
    // if (this.btnClose) {
    //   this.btnClose.addEventListener('click', this.hide.bind(this));
    //   this.btnClose.focus();
    // }

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
    //
    const handleAnimationEnd = (event) => {
      if (event.target === this.modal || this.modal.contains(event.target)) {
        this.modal.removeEventListener('animationend', handleAnimationEnd);

        document.removeEventListener('keydown', this.trapFocus);
        this.previouslyFocusedElement.focus();

        this.modal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        this.modal.setAttribute('aria-hidden', 'true');
        this.isOpen = false;
      }
    };
    this.modal.addEventListener('animationend', handleAnimationEnd);
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
    console.log(computedStyle.transition)
    return computedStyle.transition !== 'none' && computedStyle.transition !== '';
  }
}


function initButtonListeners() {
  if (typeof document !== 'undefined') {
    const buttons = document.querySelectorAll('[data-open-modal]');

    buttons.forEach((button) => {
      const targetModalId = button.getAttribute('data-open-modal');
      const modal = document.getElementById(targetModalId);

      if (modal) {
        button.addEventListener('click', () => {
          const modalInstance = new StulipanModal({
            target: `#${targetModalId}`,
          });
          modalInstance.configure({closeOnEsc: true});
          modalInstance.show();
        });
      }
    });
  }
}

initButtonListeners();
