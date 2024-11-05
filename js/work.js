// Constants and Configurations
const CONFIG = {
    FETCH_TIMEOUT: 5000,
    ANIMATION_DURATION: 500,
    BASE_PATH: '/prashant-rana', // Add base path
    PATHS: {
        WORK_DATA: '/prashant-rana/data/work.json',        // Update path
        WORK_ARTIFACTS: '/prashant-rana/work-artifacts'    // Update path
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', initializeWork);

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
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

        console.log('Fetching from:', CONFIG.PATHS.WORK_DATA); // Debug log

        const response = await fetch(CONFIG.PATHS.WORK_DATA, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error('Response not ok:', response.status, response.statusText); // Debug log
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Fetch error:', error); // Debug log
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
    }
}

async function fetchCompanyDetails(companyId) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

        const response = await fetch(`${CONFIG.PATHS.WORK_ARTIFACTS}/${companyId}/work-samples.json`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
    }
}

// Rendering Functions
function renderWorkSection(companies) {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;

    const sortedCompanies = sortCompaniesByDate(companies);
    workGrid.innerHTML = sortedCompanies.map(createCompanyTile).join('');
}

function createCompanyTile(company) {
    const { id, companyDescription, branding, name, role, timeline, scope } = company;

    return `
        <div class="company-tile fade-in" data-company-id="${id}">
            <div class="company-tooltip">${companyDescription}</div>
            <div class="logo-section" style="background-color: ${branding.colors.primary}">
                <img
                    src="${branding.logos.white}"
                    alt="${name} logo"
                    class="company-logo"
                    loading="lazy"
                >
            </div>
            <div class="content-section">
                <div class="role-header">
                    <p class="role-title">${role.title}</p>
                    <p class="timeline">${formatTimeline(timeline)}</p>
                </div>
                <p class="scope">${scope}</p>
            </div>
        </div>
    `;
}

// Event Listeners
function initializeEventListeners() {
    initializeTileListeners();
    initializeModalListeners();
}

function initializeTileListeners() {
    document.querySelectorAll('.company-tile').forEach(tile => {
        tile.addEventListener('click', handleTileClick);
    });
}

function initializeModalListeners() {
    const modal = document.getElementById('companyDetails');
    if (!modal) return;

    // Close button listener
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Outside click listener
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });

    // Escape key listener
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal(modal);
        }
    });
}

// Event Handlers
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
    if (!modal) return;

    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = createDetailsContent(details);

    modal.style.display = 'block';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function createDetailsContent(details) {
    const { overview, achievements } = details;

    return `
        <div class="details-container">
            <div class="details-header">
                <h2>${overview.industry}</h2>
                <p class="focus-areas">${overview.productFocus.join(' • ')}</p>
            </div>
            <div class="achievements-section">
                ${achievements.map(createAchievementCard).join('')}
            </div>
        </div>
    `;
}

function createAchievementCard(achievement) {
    const { title, period, description, details, media } = achievement;

    return `
        <div class="achievement-card">
            <h3>${title}</h3>
            <p class="period">${period}</p>
            <p class="description">${description}</p>
            <div class="details">
                <ul>
                    ${details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            ${media ? createMediaSection(media) : ''}
        </div>
    `;
}

function createMediaSection(media) {
    if (!media?.length) return '';

    return `
        <div class="media-section">
            ${media.map(item => `
                <figure>
                    <img
                        src="${item.src}"
                        alt="${item.alt}"
                        loading="lazy"
                    >
                    ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ''}
                </figure>
            `).join('')}
        </div>
    `;
}

// Utility Functions
function sortCompaniesByDate(companies) {
    return companies.sort((a, b) => {
        // Primary sort by importance
        if (a.importance !== b.importance) {
            return a.importance - b.importance;
        }

        // Secondary sort by date
        if (a.timeline.end === 'present') return -1;
        if (b.timeline.end === 'present') return 1;

        return new Date(b.timeline.start) - new Date(a.timeline.start);
    });
}

function formatTimeline(timeline) {
    const formattedStart = formatDate(timeline.start);
    const formattedEnd = timeline.end === 'present' ? 'Present' : formatDate(timeline.end);

    return `${formattedStart} - ${formattedEnd}`;
}

function formatDate(dateStr) {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, parseInt(month) - 1);

    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });
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