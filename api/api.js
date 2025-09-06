// api/api.js
// Centralized API call module for SStartups frontend
// Import and use these functions in any JS file for consistent API requests

/**
 * Fetch data from a GET endpoint
 * @param {string} endpoint - The API endpoint URL
 * @returns {Promise<any>} - Resolves with response data
 */
export async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`GET ${endpoint} failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`API GET Error [${endpoint}]:`, error);
        throw error;
    }
}

/**
 * Send data to a POST endpoint
 * @param {string} endpoint - The API endpoint URL
 * @param {object} data - Data to send in the request body
 * @returns {Promise<any>} - Resolves with response data
 */
export async function postData(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`POST ${endpoint} failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`API POST Error [${endpoint}]:`, error);
        throw error;
    }
}

// Example usage:
// import { fetchData, postData } from '../api/api.js';
// fetchData('https://api.example.com/places')
// postData('https://api.example.com/places', { name: 'Karura Forest' })
