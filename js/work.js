// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    initializeWork();
});

async function initializeWork() {
    try {
        const workData = await fetchWorkData();
        renderWorkSection(workData.companies);
        initializeEventListeners();
    } catch (error) {
        handleError('Failed to initialize work section', error);
    }
}

// Data Fetching
async function fetchWorkData() {
    const response = await fetch('/data/work.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function fetchCompanyDetails(companyId) {
    const response = await fetch(`/work-artifacts/${companyId}/work-samples.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Rendering Functions
function renderWorkSection(companies) {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;

    const sortedCompanies = sortCompaniesByDate(companies);
    workGrid.innerHTML = sortedCompanies.map(createCompanyTile).join('');
}

function createCompanyTile(company) {
    return `
        <div class="company-tile fade-in" data-company-id="${company.id}">
            <div class="logo-section" style="background-color: ${company.branding.colors.primary}">
                <img
                    src="${company.branding.logos.white}"
                    alt="${company.name} logo"
                    class="company-logo"
                >
            </div>
            <div class="content-section">
                <h2 class="company-name">${company.name}</h2>
                <p class="role-title">${company.role.title}</p>
                <p class="timeline">${formatTimeline(company.timeline)}</p>
                <p class="scope">${company.scope}</p>
            </div>
        </div>
    `;
}

// Event Listeners
function initializeEventListeners() {
    // Company tile click handlers
    document.querySelectorAll('.company-tile').forEach(tile => {
        tile.addEventListener('click', handleTileClick);
    });

    // Modal close handlers
    const modal = document.getElementById('companyDetails');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }

        // Close on outside click
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    }
}

async function handleTileClick(event) {
    const companyId = event.currentTarget.dataset.companyId;
    try {
        const details = await fetchCompanyDetails(companyId);
        showCompanyDetails(details);
    } catch (error) {
        handleError('Failed to load company details', error);
    }
}

// Modal Functions
function showCompanyDetails(details) {
    const modal = document.getElementById('companyDetails');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = createDetailsContent(details);
    modal.style.display = 'block';

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function createDetailsContent(details) {
    return `
        <div class="details-container">
            <div class="details-header">
                <h2>${details.overview.industry}</h2>
                <p class="focus-areas">${details.overview.productFocus.join(' • ')}</p>
            </div>
            <div class="achievements-section">
                ${details.achievements.map(createAchievementCard).join('')}
            </div>
        </div>
    `;
}

function createAchievementCard(achievement) {
    return `
        <div class="achievement-card">
            <h3>${achievement.title}</h3>
            <p class="period">${achievement.period}</p>
            <p class="description">${achievement.description}</p>
            <div class="details">
                <ul>
                    ${achievement.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            ${createMediaSection(achievement.media)}
        </div>
    `;
}

function createMediaSection(media) {
    if (!media || !media.length) return '';

    return `
        <div class="media-section">
            ${media.map(item => `
                <figure>
                    <img src="${item.src}" alt="${item.alt}">
                    ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ''}
                </figure>
            `).join('')}
        </div>
    `;
}

// Utility Functions
function sortCompaniesByDate(companies) {
    return companies.sort((a, b) => {
        if (a.timeline.end === 'present') return -1;
        if (b.timeline.end === 'present') return 1;
        return new Date(b.timeline.start) - new Date(a.timeline.start);
    });
}

function formatTimeline(timeline) {
    return `${formatDate(timeline.start)} - ${timeline.end === 'present' ? 'Present' : formatDate(timeline.end)}`;
}

function formatDate(dateStr) {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Error Handling
function handleError(message, error) {
    console.error(message, error);
    showErrorMessage(`${message}. Please try again later.`);
}

function showErrorMessage(message) {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    workGrid.insertAdjacentElement('beforebegin', errorDiv);
}