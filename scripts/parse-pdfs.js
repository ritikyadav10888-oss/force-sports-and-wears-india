const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const files = [
    'SHATAK 2023-compressed.pdf',
    'JABRAAT.pdf',
    '30 design -31-3-25.pdf'
];

async function readPdfs() {
    console.log("Starting PDF extraction...");
    for (const file of files) {
        const filePath = path.join(__dirname, '../public/catalogs', file);
        if (fs.existsSync(filePath)) {
            console.log(`\n\n--- START OF ${file} ---\n`);
            try {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                console.log(`Metadata:`, data.info);
                console.log(`Text Content:\n${data.text}`);
            } catch (e) {
                console.error(`Error parsing ${file}:`, e.message);
            }
            console.log(`\n--- END OF ${file} ---\n`);
        } else {
            console.log(`File not found: ${filePath}`);
        }
    }
}

readPdfs().catch(e => console.error(e));
