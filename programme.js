
import { getGigs } from './api.js';

// Programme elements

const programmeList = document.querySelector('#programme-list');
const status = document.querySelector('#programme-status');
const filterButtons = document.querySelectorAll('button[data-stage]');
const showMore = document.querySelector('#show-more');
const retryButton = document.querySelector('#retry-button');
const starredOnly = document.querySelector('#starred-only');

// Programme state

let gigs = [];
let nextCursor = null;
let total = 0;
let selectedStage = 'all';
let loading = false;
let failed = false;

// Load saved favourite gigs

let starred = [];

try {
    const saved = JSON.parse(
        localStorage.getItem('starred-gigs') || '[]'
    );

    if (Array.isArray(saved)) {
        starred = saved;
    }
} catch {
    starred = [];
}

// Save favourite gigs

function saveStars() {
    try {
        localStorage.setItem(
            'starred-gigs',
            JSON.stringify(starred)
        );
    } catch {
        status.textContent =
            'Your favourites could not be saved.';
    }
}

// Format festival dates

function formatDate(day) {
    if (!day) {
        return 'Date to be announced';
    }

    const date = new Date(`${day}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return 'Date to be announced';
    }

    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

// Create one programme item

function createGig(gig) {
    const item = document.createElement('li');
    item.className = 'gig-card';

    const heading = document.createElement('h3');
    heading.textContent = gig.artist || 'Artist to be announced';
    item.appendChild(heading);

    // Artist image

    if (gig.image) {
        const image = document.createElement('img');

        image.alt = gig.artist || 'Festival artist';
        image.loading = 'lazy';

        image.addEventListener('error', () => {
            image.remove();
        });

        image.src = gig.image;
        item.appendChild(image);
    }

    // Festival date and time

    const date = document.createElement('p');

    date.textContent =
        `${formatDate(gig.day)} · ${gig.start || 'Time TBA'}`;

    item.appendChild(date);

    // Stage

    const stage = document.createElement('p');
    stage.textContent = `Stage: ${gig.stage || 'To be announced'}`;
    item.appendChild(stage);

    // Genre

    const genre = document.createElement('p');
    genre.textContent = `Genre: ${gig.genre || 'Not specified'}`;
    item.appendChild(genre);

    // Duration

    const duration = document.createElement('p');

    duration.textContent = gig.length_min != null
        ? `Duration: ${gig.length_min} minutes`
        : 'Duration: To be announced';

    item.appendChild(duration);

    // Star button

    if (gig.id) {
        const starButton = document.createElement('button');

        starButton.type = 'button';
        starButton.className = 'star-button';

        function updateStarButton() {
            const isStarred = starred.includes(gig.id);

            starButton.textContent = isStarred
                ? '★ Starred'
                : '☆ Star';

            starButton.setAttribute(
                'aria-pressed',
                String(isStarred)
            );

            starButton.setAttribute(
                'aria-label',
                `Star ${gig.artist || 'gig'}`
            );
        }

        updateStarButton();

        starButton.addEventListener('click', () => {
            if (starred.includes(gig.id)) {
                starred = starred.filter(id => id !== gig.id);
            } else {
                starred.push(gig.id);
            }

            updateStarButton();

            if (starredOnly.checked) {
                renderGigs();
                starredOnly.focus();
            }

            saveStars();
        });

        item.appendChild(starButton);
    }

    return item;
}

// Display and filter gigs

function renderGigs() {
    programmeList.replaceChildren();

    const filteredGigs = gigs.filter(gig => {
        const matchesStage =
            selectedStage === 'all' ||
            gig.stage === selectedStage;

        const matchesStar =
            !starredOnly.checked ||
            starred.includes(gig.id);

        return matchesStage && matchesStar;
    });

    filteredGigs.forEach(gig => {
        programmeList.appendChild(createGig(gig));
    });

    if (loading || failed) {
        return;
    }

    if (gigs.length === 0) {
        status.textContent = 'No gigs are currently available.';
    } else if (filteredGigs.length === 0) {
        status.textContent = nextCursor
            ? 'No matching gigs loaded. Select Show more.'
            : 'No gigs match your selection.';
    } else {
        status.textContent =
            `Showing ${filteredGigs.length} matching gigs. ` +
            `${gigs.length} of ${total} gigs loaded.`;
    }
}

// Load gigs from the API

async function loadGigs() {
    if (loading) {
        return;
    }

    loading = true;
    failed = false;

    status.textContent = 'Loading programme...';

    showMore.disabled = true;
    retryButton.hidden = true;

    try {
        const data = await getGigs(nextCursor);

        if (!Array.isArray(data.items)) {
            throw new Error('Invalid programme data');
        }

        gigs.push(...data.items);

        total = data.total ?? gigs.length;
        nextCursor = data.next || null;

    } catch (error) {
        failed = true;

        status.textContent =
            'Unable to load the programme. ' +
            'Please try again. ' + error.message;

        retryButton.hidden = false;

    } finally {
        loading = false;

        showMore.hidden = !nextCursor;
        showMore.disabled = failed;

        renderGigs();
    }
}

// Stage filter buttons

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedStage = button.dataset.stage;

        filterButtons.forEach(otherButton => {
            otherButton.setAttribute(
                'aria-pressed',
                String(otherButton === button)
            );
        });

        renderGigs();
    });
});

// Starred-only filter

starredOnly.addEventListener('change', renderGigs);

// Pagination

showMore.addEventListener('click', loadGigs);

// Retry after an error

retryButton.addEventListener('click', loadGigs);

// Load the first page

loadGigs();
