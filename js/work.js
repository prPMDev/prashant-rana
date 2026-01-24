// Constants and Configurations
const CONFIG = {
    FETCH_TIMEOUT: 5000,
    ANIMATION_DURATION: 200,
    PATHS: {
        WORK_DATA: 'data/work.json'
    }
};

const ErrorTypes = {
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    DATA_INVALID: 'DATA_INVALID',
    IMAGE_LOAD_ERROR: 'IMAGE_LOAD_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// State
let currentView = 'professional';

// Main Initialization
document.addEventListener('DOMContentLoaded', initializeWork);

async function initializeWork() {
    try {
        console.log('Initializing work section...');
        const workData = await fetchWorkData();

        if (!workData?.items || !Array.isArray(workData.items)) {
            throw new Error(createErrorMessage(ErrorTypes.DATA_INVALID, 'missing items array'));
        }

        if (!validateItemData(workData.items)) {
            throw new Error(createErrorMessage(ErrorTypes.DATA_INVALID, 'work.json'));
        }

        window.workData = workData;
        console.log('Valid work data received, rendering section...');

        initializeToggle();
        renderWorkSection(currentView);
        initializeEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        handleError('Failed to initialize work section', error);
    }
}

// Toggle Functions
function initializeToggle() {
    const toggleContainer = document.querySelector('.view-toggle');
    if (!toggleContainer) return;

    toggleContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-pill')) {
            const view = e.target.dataset.view;
            if (view && view !== currentView) {
                setActiveView(view);
            }
        }
    });
}

function setActiveView(view) {
    currentView = view;

    // Update pill states
    document.querySelectorAll('.toggle-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.view === view);
    });

    // Fade out, swap content, fade in
    const workGrid = document.querySelector('.work-grid');
    if (workGrid) {
        workGrid.style.opacity = '0';
        setTimeout(() => {
            renderWorkSection(view);
            workGrid.style.opacity = '1';
        }, CONFIG.ANIMATION_DURATION);
    }
}

// Data Fetching
async function fetchWorkData() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

        console.log(`Attempting to fetch work data from: ${CONFIG.PATHS.WORK_DATA}`);

        const response = await fetch(CONFIG.PATHS.WORK_DATA, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(createErrorMessage(ErrorTypes.FILE_NOT_FOUND, 'work.json'));
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Successfully fetched work data');
        return data;
    } catch (error) {
        console.error('Fetch error details:', error);

        if (error.name === 'AbortError') {
            throw new Error(createErrorMessage(ErrorTypes.NETWORK_ERROR, 'request timeout'));
        }
        if (error.name === 'SyntaxError') {
            throw new Error(createErrorMessage(ErrorTypes.DATA_INVALID, 'invalid JSON format in work.json'));
        }
        throw error;
    }
}

// Rendering Functions
function renderWorkSection(viewType) {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) {
        console.error('Work grid element not found');
        return;
    }

    workGrid.dataset.view = viewType;

    const items = window.workData.items
        .filter(item => item.type === viewType || (viewType === 'professional' && item.type === 'internship'))
        .sort((a, b) => a.rank - b.rank);

    workGrid.innerHTML = items.map(createItemTile).join('');

    // Re-initialize tile listeners after render
    initializeTileListeners();
}

function createItemTile(item) {
    const { id, companyDescription, branding, name, role, tags, overview } = item;

    const hasLogo = branding?.logos?.white;
    const imagePath = hasLogo ? branding.logos.white : '';

    const tagsHtml = tags && tags.length > 0
        ? `<div class="tile-tags">${tags.slice(0, 3).map(tag => `<span class="tile-tag">${tag}</span>`).join('')}</div>`
        : '';

    const descriptionHtml = overview?.description
        ? `<p class="tile-description" title="${overview.description}">${overview.description}</p>`
        : '';

    return `
        <div class="company-tile fade-in" data-company-id="${id}">
            <div class="company-tooltip">${companyDescription}</div>
            <div class="logo-section" style="background-color: ${branding.colors.primary}">
                ${hasLogo ? `
                <img
                    src="${imagePath}"
                    alt="${name} logo"
                    class="company-logo"
                    loading="lazy"
                    onerror="handleImageError(this, '${id}')"
                >` : `<span style="color: white; font-weight: 600; font-size: 1.2em;">${name}</span>`}
            </div>
            <div class="content-section">
                <div class="role-header">
                    <p class="role-title">${role.title}</p>
                </div>
                ${descriptionHtml}
                ${tagsHtml}
            </div>
        </div>
    `;
}

function createDetailsContent(details) {
    const { achievements } = details;

    return `
        <div class="details-container">
            <div class="achievements-section">
                ${achievements.map(achievement => `
                    <div class="achievement-card">
                        <div class="achievement-header">
                            <div>
                                <h3>${achievement.title}</h3>
                                ${achievement.links?.length ? `
                                    <div class="achievement-links">
                                        ${achievement.links.map((link, i) => `
                                            <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>${i < achievement.links.length - 1 ? '<span class="link-separator">·</span>' : ''}
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div class="achievement-body ${achievement.videoUrl ? 'has-video' : ''}">
                            <div class="achievement-content">
                                <p class="description">${achievement.description}</p>
                                <ul class="impact-list">
                                    ${achievement.impact.map(item => `
                                        <li>${item}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            ${achievement.videoUrl ? `
                                <div class="achievement-video">
                                    <div class="video-container">
                                        <iframe
                                            src="https://www.youtube.com/embed/${achievement.videoUrl.includes('watch?v=') ? achievement.videoUrl.split('watch?v=')[1].split('&')[0] : achievement.videoUrl}"
                                            title="${achievement.title} video"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen
                                            loading="lazy">
                                        </iframe>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
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
    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal(modal);
        }
    });
}

// Event Handlers
function handleTileClick(event) {
    const itemId = event.currentTarget.dataset.companyId;
    const itemData = window.workData.items.find(item => item.id === itemId);

    if (itemData) {
        showCompanyDetails(itemData);
    } else {
        console.error(`Item data not found for ID: ${itemId}`);
    }
}

// Modal Functions
function showCompanyDetails(details) {
    const modal = document.getElementById('companyDetails');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
        console.error('Modal body element not found');
        return;
    }

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

// Validation Functions
function validateItemData(items) {
    const validationErrors = [];

    items.forEach(item => {
        const errors = [];

        if (!item.id) errors.push('Missing item ID');
        if (!item.name) errors.push('Missing item name');
        if (!item.type) errors.push('Missing item type');
        if (typeof item.rank !== 'number') errors.push('Missing or invalid rank');
        if (!item.branding?.colors?.primary) errors.push('Missing branding colors');
        if (!item.role?.title) errors.push('Missing role title');
        if (!item.overview?.description) errors.push('Missing overview description');
        if (!Array.isArray(item.achievements)) errors.push('Missing or invalid achievements array');

        if (errors.length > 0) {
            validationErrors.push({
                item: item.id || 'Unknown Item',
                errors
            });
        }
    });

    if (validationErrors.length > 0) {
        console.error('Item Data Validation Errors:', validationErrors);
        return false;
    }

    return true;
}

// Error Handling Functions
function createErrorMessage(type, details) {
    switch (type) {
        case ErrorTypes.FILE_NOT_FOUND:
            return `Failed to load ${details}. Please verify the file exists in the correct location.`;
        case ErrorTypes.DATA_INVALID:
            return `Invalid data structure in ${details}. Please check the console for specific validation errors.`;
        case ErrorTypes.IMAGE_LOAD_ERROR:
            return `Failed to load image for ${details}. Please verify image exists and is correctly named.`;
        case ErrorTypes.NETWORK_ERROR:
            return `Network error while fetching ${details}. Please check your connection.`;
        default:
            return `An unexpected error occurred: ${details}`;
    }
}

function handleImageError(img, itemId) {
    console.error(`Failed to load image for item: ${itemId}`);
    img.onerror = null;
    img.style.display = 'none';
}

function handleError(message, error) {
    console.error(message, error);
    showErrorMessage(`${message}. Please try again later.`);
}

function showErrorMessage(message, type = 'error') {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = `error-message ${type}`;
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">${type === 'error' ? '❌' : '⚠️'}</span>
            <span class="error-text">${message}</span>
        </div>
    `;

    workGrid.insertAdjacentElement('beforebegin', errorDiv);
}

console.log('Work.js loaded successfully');
