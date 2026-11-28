
# Pohjanpiha Festival

## Client-Side Programming – Autumn 2026

## Project Overview

Pohjanpiha Festival is a summer music festival in Alavus, Finland.

The goal of this project is to create a simple, fast, responsive and accessible website where visitors can explore the festival programme, find festival information and prepare contact enquiries.

## Live Website

https://linda7278.github.io/softautumn2026/

## Customer

- Festival: Pohjanpiha Festival
- Customer number: 3
- Location: Alavus, Finland
- Contact person: Noora Lehtimäki
- Festival dates: 16–17 July 2027

## Website Pages

- Home: Introduction to the festival.
- About: Festival information and accessibility.
- Programme: Festival gigs loaded from the API.
- Contact: Contact form with accessible validation.

## Technologies

- HTML5
- CSS3
- JavaScript
- JavaScript modules
- Fetch API
- LocalStorage
- GitHub Pages

## E1 and E2 – Website Structure and Styling

- Semantic HTML structure.
- Consistent navigation.
- Responsive desktop and mobile layouts.
- Consistent colours, fonts and spacing.
- Dark mode support.
- Keyboard accessibility.

## E3 – JavaScript Interactivity

- Programme filtering by stage.
- Accessible contact form validation.
- Clear validation and status messages.
- Contact form draft saving using LocalStorage.
- Festival information popover.

The contact form is a client-side demonstration and does not send messages to a server.

## E4 – API Integration

The website retrieves festival data from the course API.

API base URL:

https://vectorsigma.org/briefer/api/v1

Customer number: 3

### API Endpoints

- `/customer?customer=3`
- `/items?customer=3`

### E4 Features

- Dynamic festival programme.
- Festival information loaded from the customer API.
- Loading, empty and error states.
- HTTP 429 handling using Retry-After.
- Limited retry attempts.
- Pagination using the Show more button.
- Stage filtering on loaded programme data.
- Handling missing information and images.
- Responsive programme cards.

## Client Change Request

The client requested that visitors should be able to star gigs, keep their starred gigs after reloading the website and show only starred gigs.

### Implementation

The feature is implemented on the Programme page.

Visitors can:

- Star their favourite gigs.
- Remove gigs from their favourites.
- Keep their starred gigs after refreshing the page.
- Filter the programme to show only starred gigs.

Starred gig IDs are stored in LocalStorage.

Relevant files:

- `listing.html`
- `programme.js`
- `style.css`

## Project Structure

- `index.html` – Home page
- `about.html` – Festival information
- `listing.html` – Festival programme
- `contact.html` – Contact form
- `style.css` – Website styling
- `app.js` – Contact form interactivity
- `api.js` – API requests and retry handling
- `programme.js` – Programme rendering, filtering and favourites
- `customer.js` – Customer information rendering
- `plan.md` – Website plan
- `moodboard.md` – Visual design planning
- `ai-log.md` – AI usage documentation
- `README.md` – Project documentation

## Running the Project

The website can be accessed through GitHub Pages.

For local development, open the project using a local web server, such as Live Server in Visual Studio Code.

## AI Usage

AI assistance is documented in `ai-log.md`.
