// Logo Bar Component
// Renders company and project logo bars from JSON data

const LOGO_BAR_CONFIG = {
    companies: {
        dataPath: 'data/companies.json',
        containerId: 'logo-bar',
        linkBase: 'work.html#'
    },
    projects: {
        dataPath: 'data/projects.json',
        containerId: 'project-bar'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initializeLogoBar();
    initializeProjectBar();
});

async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    return response.json();
}

async function initializeLogoBar() {
    const container = document.getElementById(LOGO_BAR_CONFIG.companies.containerId);
    if (!container) return;

    try {
        const companies = await fetchJson(LOGO_BAR_CONFIG.companies.dataPath);
        renderLogoBar(container, companies);
    } catch (error) {
        console.error('Failed to initialize logo bar:', error);
    }
}

async function initializeProjectBar() {
    const container = document.getElementById(LOGO_BAR_CONFIG.projects.containerId);
    if (!container) return;

    try {
        const projects = await fetchJson(LOGO_BAR_CONFIG.projects.dataPath);
        renderProjectBar(container, projects);
    } catch (error) {
        console.error('Failed to initialize project bar:', error);
    }
}

function renderLogoBar(container, companies) {
    const logosHtml = companies.map(company => `
        <a href="${LOGO_BAR_CONFIG.companies.linkBase}${company.id}"
           class="logo-bar-item"
           title="${company.name}"
           aria-label="View ${company.name} work">
            <img src="${company.logo}"
                 alt="${company.name}"
                 loading="lazy">
        </a>
    `).join('');

    container.insertAdjacentHTML('beforeend', logosHtml);
}

function renderProjectBar(container, projects) {
    const logosHtml = projects.map(project => `
        <a href="${project.url}"
           class="logo-bar-item"
           title="${project.name}"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="View ${project.name}">
            <img src="${project.logo}"
                 alt="${project.name}"
                 loading="lazy">
        </a>
    `).join('');

    container.insertAdjacentHTML('beforeend', logosHtml);
}
