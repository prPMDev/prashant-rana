// Constants and Configurations
const CONFIG = {
    FETCH_TIMEOUT: 5000,
    ANIMATION_DURATION: 500,
    BASE_PATH: '/prashant-rana',
    PATHS: {
        WORK_DATA: '/prashant-rana/data/work.json'
    }
};

const ErrorTypes = {
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    DATA_INVALID: 'DATA_INVALID',
    IMAGE_LOAD_ERROR: 'IMAGE_LOAD_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Main Initialization
document.addEventListener('DOMContentLoaded', initializeWork);

async function initializeWork() {
    try {
        console.log('Initializing work section...');
        const workData = await fetchWorkData();

        if (!workData?.companies || !Array.isArray(workData.companies)) {
            throw new Error(createErrorMessage(ErrorTypes.DATA_INVALID, 'missing companies array'));
        }

        if (!validateCompanyData(workData.companies)) {
            throw new Error(createErrorMessage(ErrorTypes.DATA_INVALID, 'work.json'));
        }

        window.workData = workData; // Store for modal use
        console.log('Valid work data received, rendering section...');
        renderWorkSection(workData.companies);
        initializeEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        handleError('Failed to initialize work section', error);
    }
}

// Data Fetching
async function fetchWorkData() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

        console.log(`Attempting to fetch work data from: ${CONFIG.PATHS.WORK_DATA}`);

        const response = await fetch(`${CONFIG.BASE_PATH}/data/work.json`, {
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
function renderWorkSection(companies) {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) {
        console.error('Work grid element not found');
        return;
    }

    const sortedCompanies = sortCompaniesByDate(companies);
    workGrid.innerHTML = sortedCompanies.map(createCompanyTile).join('');
}

function createCompanyTile(company) {
    const { id, companyDescription, branding, name, role, timeline } = company;

    const imagePath = `${CONFIG.BASE_PATH}/images/company-logos/${id}-logo-transparent.png`;
    console.log(`Loading company logo from: ${imagePath}`);

    return `
        <div class="company-tile fade-in" data-company-id="${id}">
            <div class="company-tooltip">${companyDescription}</div>
            <div class="logo-section" style="background-color: ${branding.colors.primary}">
                <img
                    src="${imagePath}"
                    alt="${name} logo"
                    class="company-logo"
                    loading="lazy"
                    onerror="handleImageError(this, '${id}')"
                >
            </div>
            <div class="content-section">
                <div class="role-header">
                    <p class="role-title">${role.title}</p>
                    <p class="timeline">${formatTimeline(timeline)}</p>
                </div>
                <p class="scope">${company.overview.description}</p>
            </div>
        </div>
    `;
}

function createDetailsContent(details) {
    const { overview, achievements } = details;

    return `
        <div class="details-container">
            <div class="details-header">
                <div class="skillset-container">
                    <div class="technical-skills">
                        <h3>Technical Skills</h3>
                        <div class="skill-tags">
                            ${overview.skillset.technical.map(skill => `
                                <span class="skill-tag technical">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="functional-skills">
                        <h3>Functional Skills</h3>
                        <div class="skill-tags">
                            ${overview.skillset.functional.map(skill => `
                                <span class="skill-tag functional">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="achievements-section">
                ${achievements.map(achievement => `
                    <div class="achievement-card">
                        <div class="achievement-header">
                            <div>
                                <h3>${achievement.title}</h3>
                                <span class="period">${achievement.period}</span>
                            </div>
                            ${achievement.projectUrl ? `
                                <a href="${achievement.projectUrl}"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   class="project-link"
                                   title="View Project">
                                    <span class="link-icon">→</span>
                                </a>
                            ` : ''}
                        </div>
                        <p class="description">${achievement.description}</p>
                        <ul class="impact-list">
                            ${achievement.impact.map(item => `
                                <li>${item}</li>
                            `).join('')}
                        </ul>
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

    // Close on outside click
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal(modal);
        }
    });
}

// Event Handlers
function handleTileClick(event) {
    const companyId = event.currentTarget.dataset.companyId;
    const companies = document.querySelectorAll('.company-tile');
    const clickedCompany = Array.from(companies).find(
        company => company.dataset.companyId === companyId
    );

    if (clickedCompany) {
        const companyData = window.workData.companies.find(
            company => company.id === companyId
        );
        if (companyData) {
            showCompanyDetails(companyData);
        } else {
            console.error(`Company data not found for ID: ${companyId}`);
        }
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
function validateCompanyData(companies) {
    const validationErrors = [];

    companies.forEach(company => {
        const errors = [];

        // Check required fields
        if (!company.id) errors.push('Missing company ID');
        if (!company.name) errors.push('Missing company name');
        if (!company.branding?.colors?.primary) errors.push('Missing branding colors');
        if (!company.role?.title) errors.push('Missing role title');
        if (!company.timeline?.start) errors.push('Missing timeline start');

        // Check data structure
        if (!company.overview?.description) errors.push('Missing overview description');
        if (!company.overview?.skillset?.technical) errors.push('Missing technical skillset');
        if (!company.overview?.skillset?.functional) errors.push('Missing functional skillset');
        if (!Array.isArray(company.achievements)) errors.push('Missing or invalid achievements array');

        if (errors.length > 0) {
            validationErrors.push({
                company: company.id || 'Unknown Company',
                errors
            });
        }
    });

    if (validationErrors.length > 0) {
        console.error('Company Data Validation Errors:', validationErrors);
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

function handleImageError(img, companyId) {
    console.error(`Failed to load image for company: ${companyId}`);
    img.onerror = null; // Prevent infinite loop
    img.src = `${CONFIG.BASE_PATH}/images/placeholder.txt`;
    showErrorMessage(createErrorMessage(ErrorTypes.IMAGE_LOAD_ERROR, companyId), 'warning');
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

// Utility Functions
function sortCompaniesByDate(companies) {
    return companies.sort((a, b) => {
        if (a.importance !== b.importance) {
            return a.importance - b.importance;
        }

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
    // Just return the year
    return year;
}

// Add this for debugging purposes
console.log('Work.js loaded successfully');