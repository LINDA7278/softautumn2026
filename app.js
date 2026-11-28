const filterButtons = document.querySelectorAll('button[data-stage]');

const programmeItems = document.querySelectorAll('.programme-list li[data-stage]');

const programmeStatus = document.querySelector('#programme-status');
 
if (filterButtons.length > 0 && programmeItems.length > 0) {

    const updateProgramme = (selectedStage) => {

        let visibleCount = 0;
 
        for (const item of programmeItems) {

            const matches = selectedStage === 'all' || item.dataset.stage === selectedStage;

            item.hidden = !matches;

            if (matches) {

                visibleCount++;

            }

        }
 
        if (programmeStatus) {

            programmeStatus.textContent = `Showing ${visibleCount} of ${programmeItems.length} programme items.`;

        }

    };
 
    for (const button of filterButtons) {

        button.addEventListener('click', () => {

            const stage = button.dataset.stage;
 
            for (const other of filterButtons) {

                other.setAttribute('aria-pressed', String(other === button));

            }
 
            updateProgramme(stage);

        });

    }
 
    updateProgramme('all');

}
 
const contactForm = document.querySelector('#form');

const statusMessage = document.querySelector('#message');

const DRAFT_KEY = 'pohjanpiha-contact-draft';
 
if (contactForm) {

    contactForm.noValidate = true;

    const fields = contactForm.querySelectorAll('input, textarea');
 
    const getErrorMessage = (field) => {

        const v = field.validity;

        if (v.valueMissing) {

            if (field.name === 'name') return 'Please enter your name.';

            if (field.name === 'email') return 'Please enter your email address.';

            if (field.name === 'question') return 'Please enter your question.';

            return 'This field is required.';

        }

        if (v.typeMismatch && field.type === 'email') {

            return 'Please enter a valid email address (for example, name@example.com).';

        }

        if (v.tooShort) {

            return `Please enter at least ${field.minLength} characters.`;

        }

        return 'Please check this field.';

    };
 
    const showFieldError = (field, text) => {

        const errorEl = document.querySelector(`#${field.id}-error`);

        if (errorEl) {

            errorEl.textContent = text;

        }

        field.setAttribute('aria-invalid', 'true');

    };
 
    const clearFieldError = (field) => {

        const errorEl = document.querySelector(`#${field.id}-error`);

        if (errorEl) {

            errorEl.textContent = '';

        }

        field.removeAttribute('aria-invalid');

    };
 
    const savedRaw = localStorage.getItem(DRAFT_KEY);

    if (savedRaw) {

        try {

            const savedData = JSON.parse(savedRaw);

            for (const [key, value] of Object.entries(savedData)) {

                if (contactForm.elements[key] && typeof value === 'string') {

                    contactForm.elements[key].value = value;

                }

            }

        } catch {

            localStorage.removeItem(DRAFT_KEY);

        }

    }
 
    contactForm.addEventListener('input', (event) => {

        const target = event.target;

        if (target instanceof HTMLElement && target.matches('input, textarea')) {

            if (target.getAttribute('aria-invalid') === 'true' && target.validity.valid) {

                clearFieldError(target);

            }

            const currentData = Object.fromEntries(new FormData(contactForm));

            localStorage.setItem(DRAFT_KEY, JSON.stringify(currentData));

        }

    });
 
    contactForm.addEventListener('submit', (event) => {

        event.preventDefault();
 
        let firstInvalid = null;
 
        for (const field of fields) {

            if (field.validity.valid) {

                clearFieldError(field);

            } else {

                showFieldError(field, getErrorMessage(field));

                if (!firstInvalid) {

                    firstInvalid = field;

                }

            }

        }
 
        if (firstInvalid) {

            if (statusMessage) {

                statusMessage.textContent = '';

            }

            firstInvalid.focus();

            return;

        }
 
        if (statusMessage) {

            statusMessage.textContent = 'Your question is ready! It has not been sent yet.';

        }
 
        localStorage.removeItem(DRAFT_KEY);

        contactForm.reset();

    });

}
 