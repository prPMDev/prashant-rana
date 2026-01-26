// Logo Bar Component
// Reusable component for displaying company logos with links to work page

const LOGO_BAR_CONFIG = {
    dataPath: 'data/companies.json',
    workPagePath: 'work.html'
};

document.addEventListener('DOMContentLoaded', initializeLogoBar);

async function initializeLogoBar() {
    const container = document.getElementById('logo-bar');
    if (!container) return;

    try {
        const companies = await fetchCompanies();
        renderLogoBar(container, companies);
    } catch (error) {
        console.error('Failed to initialize logo bar:', error);
    }
}

async function fetchCompanies() {
    const response = await fetch(LOGO_BAR_CONFIG.dataPath);
    if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.status}`);
    }
    return response.json();
}

function renderLogoBar(container, companies) {
    const logosHtml = companies.map(company => `
        <a href="${LOGO_BAR_CONFIG.workPagePath}#${company.id}"
           class="logo-bar-item"
           title="${company.name}"
           aria-label="View ${company.name} work">
            <img src="${company.logo}"
                 alt="${company.name}"
                 loading="lazy">
        </a>
    `).join('');

    container.innerHTML = logosHtml;
}

// Logo bar component ready
