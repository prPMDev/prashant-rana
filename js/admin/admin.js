// admin.js
import AdminAuth from './admin-auth.js';

class AdminPanel {
    constructor() {
        this.adminRoot = document.getElementById('admin-root');
        this.initialize();
    }

    initialize() {
        if (!AdminAuth.isAuthenticated()) {
            this.renderLoginForm();
        } else {
            this.renderAdminInterface();
        }
    }

    renderLoginForm() {
        this.adminRoot.innerHTML = `
            <div class="admin-login">
                <h2>Admin Login</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            if (AdminAuth.login(password)) {
                this.renderAdminInterface();
            } else {
                alert('Invalid password');
            }
        });
    }

    renderAdminInterface() {
        this.adminRoot.innerHTML = `
            <div class="admin-container">
                <div class="admin-header">
                    <h1>Portfolio Admin</h1>
                    <button onclick="AdminAuth.logout()" class="btn-secondary">Logout</button>
                </div>
                <div class="tab-container">
                    <div class="tab-header">
                        <button class="tab-button active" data-tab="companies">Companies</button>
                        <button class="tab-button" data-tab="projects">Projects</button>
                        <button class="tab-button" data-tab="config">Configuration</button>
                    </div>
                    <div id="companies-tab" class="tab-content active">
                        <!-- Companies content will be loaded here -->
                    </div>
                    <div id="projects-tab" class="tab-content">
                        <!-- Projects content will be loaded here -->
                    </div>
                    <div id="config-tab" class="tab-content">
                        <!-- Configuration content will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        this.initializeTabs();
        this.loadCompaniesTab();
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content =>
                    content.classList.remove('active'));

                // Add active class to clicked tab
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');

                // Load content based on tab
                switch(tabId) {
                    case 'companies':
                        this.loadCompaniesTab();
                        break;
                    case 'projects':
                        this.loadProjectsTab();
                        break;
                    case 'config':
                        this.loadConfigTab();
                        break;
                }
            });
        });
    }

    async loadCompaniesTab() {
        const companiesTab = document.getElementById('companies-tab');
        try {
            const response = await fetch('/work-artifacts/companies.json');
            const data = await response.json();

            companiesTab.innerHTML = `
                <div class="admin-grid">
                    ${data.companies.map(company => `
                        <div class="admin-card">
                            <h3>${company.name}</h3>
                            <p>${company.period}</p>
                            <div class="card-actions">
                                <button onclick="editCompany('${company.id}')" class="btn-primary">Edit</button>
                                <button onclick="deleteCompany('${company.id}')" class="btn-danger">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                    <div class="admin-card">
                        <h3>Add New Company</h3>
                        <button onclick="addNewCompany()" class="btn-primary">Add</button>
                    </div>
                </div>
            `;
        } catch (error) {
            companiesTab.innerHTML = '<p class="alert alert-danger">Error loading companies</p>';
        }
    }

    // Additional methods for handling companies, projects, and configuration
    // will be added here...
}

// Initialize the admin panel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});