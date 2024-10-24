// js/config.js
const SITE_CONFIG = {
    // Site Information
    siteName: "Prashant Rana",
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? ''
        : '/prashant-rana',

    // Image paths
    paths: {
        profilePictures: '/images/profile-pictures/',
        socialMedia: '/images/social-media/',
        companyLogos: '/images/company-logos/',
        placeholder: '/images/placeholder.png'
    },

    // Contact Form Settings
    contactForm: {
        endpoint: "/api/contact",
        allowedQueryTypes: ["job", "mentorship", "collaboration", "other"],
        allowedEmailDomains: ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
    },

    // Utility function to get correct paths
    getImagePath: function(type, filename) {
        return `${this.baseUrl}${this.paths[type]}${filename}`;
    }
};

// Make config immutable
Object.freeze(SITE_CONFIG);