/**
 * BFSI Compliance Radar Utility Hub
 * Handles exporting capabilities (CSV, JSON), date parsing, and DOM helper triggers.
 */

/**
 * Exports data list to CSV format download
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Target download filename
 */
export function exportToCSV(data, filename = 'bfsi-regulations.csv') {
    if (!data || !data.length) {
        console.warn("No data provided for CSV export.");
        return;
    }

    // Extract flat keys
    const headers = Object.keys(data[0]).filter(key => {
        const val = data[0][key];
        return typeof val !== 'object' && typeof val !== 'function';
    });

    const csvRows = [];

    // Header row
    csvRows.push(headers.map(h => `"${h.toUpperCase()}"`).join(','));

    // Data rows
    for (const item of data) {
        const values = headers.map(header => {
            const val = item[header] === undefined || item[header] === null ? '' : item[header];
            // Escape inner quotes
            const escaped = ('' + val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, filename);
}

/**
 * Exports data list to JSON format download
 * @param {Array} data - Array/Object to export
 * @param {string} filename - Target filename
 */
export function exportToJSON(data, filename = 'bfsi-compliance-data.json') {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    triggerDownload(blob, filename);
}

/**
 * Triggers a file download using HTML Blob Object
 * @param {Blob} blob 
 * @param {string} filename 
 */
function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Format raw ISO YYYY-MM-DD to a standard long date format
 * @param {string} dateString 
 * @returns {string} Fully readable date
 */
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', options);
}

/**
 * Filters list matching string queries
 * @param {string} sourceText 
 * @param {string} queryText 
 * @returns {boolean}
 */
export function searchMatches(sourceText, queryText) {
    if (!sourceText || !queryText) return false;
    return sourceText.toLowerCase().includes(queryText.trim().toLowerCase());
}
