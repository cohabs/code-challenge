const fs = require('fs').promises;

//Reads a JSON file asynchronously.

async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        throw new Error(`Failed to read JSON file: ${filePath}`);
    }
}

//Write a json file
async function writeJsonFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Successfully wrote data to ${filePath}`);
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error.message);
        throw new Error(`Failed to write JSON file: ${filePath}`);
    }
}

module.exports = {
    readJsonFile,
    writeJsonFile
};
