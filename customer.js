
import { getCustomer } from './api.js';

// Customer information elements

const details = document.querySelector('#customer-details');
const status = document.querySelector('#customer-status');
const retryButton = document.querySelector('#customer-retry');

// Format dates

function formatDate(value) {
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return 'Date to be announced';
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

// Display one piece of information

function addDetail(label, value) {
    const paragraph = document.createElement('p');
    const heading = document.createElement('strong');

    heading.textContent = `${label}: `;

    paragraph.appendChild(heading);

    paragraph.appendChild(
        document.createTextNode(value || 'Not available')
    );

    details.appendChild(paragraph);
}

// Load customer information

async function loadCustomer() {
    status.textContent = 'Loading festival information...';

    retryButton.hidden = true;
    details.replaceChildren();

    try {
        const customer = await getCustomer();

        if (!customer || !customer.company) {
            status.textContent =
                'No festival information is currently available.';
            return;
        }

        addDetail('Festival', customer.company);
        addDetail('Type', customer.type);
        addDetail('Town', customer.town);
        addDetail('Address', customer.address);
        addDetail('Contact person', customer.contact);

        const dates = Array.isArray(customer.dates)
            ? customer.dates.filter(Boolean).map(formatDate).join(' – ')
            : '';

        addDetail('Festival dates', dates);

        // Ticket link

        if (customer.tickets) {
            const url = new URL(customer.tickets);

            if (url.protocol === 'https:' ||
                url.protocol === 'http:') {

                const paragraph = document.createElement('p');
                const link = document.createElement('a');

                link.href = url.href;
                link.textContent = 'Visit ticket partner';

                paragraph.appendChild(link);
                details.appendChild(paragraph);
            }
        }

        status.textContent = 'Festival information loaded.';

    } catch (error) {
        details.replaceChildren();

        status.textContent =
            'Unable to load festival information. Please try again.';

        retryButton.hidden = false;
    }
}

// Retry button

retryButton.addEventListener('click', loadCustomer);

// Load information when the page opens

loadCustomer();
