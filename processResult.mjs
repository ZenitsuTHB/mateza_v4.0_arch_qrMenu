// processResult.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to configuration and result files
const configFilePath = path.join(__dirname, 'prompts', 'lastFolder.json');
const resultFilePath = path.join(__dirname, 'result.txt');

/**
 * Reads the last selected folder from lastFolder.json.
 * @returns {string} The path to the last selected folder.
 */
function getLastFolder() {
    if (fs.existsSync(configFilePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
            return data.lastFolder || null;
        } catch (error) {
            console.error('Error: lastFolder.json is malformed.');
            process.exit(1);
        }
    }
    console.error('Error: lastFolder.json does not exist.');
    process.exit(1);
}

/**
 * Parses the result.txt content and extracts changed and unchanged files with their content.
 * @param {string} content - The content of result.txt.
 * @returns {Object} An object containing arrays of changed and unchanged files.
 */
function parseResult(content) {
    const sections = content.split(/(?=CHANGED|--unchanged)/g); // Split and keep delimiters
    const changedFiles = [];
    const unchangedFiles = [];

    sections.forEach(section => {
        section = section.trim();
        if (section.startsWith('CHANGED')) {
            const fileData = extractFileData(section.replace(/^CHANGED\s*/, ''));
            if (fileData) {
                changedFiles.push(fileData);
            }
        } else if (section.startsWith('--unchanged')) {
            const fileData = extractFileData(section.replace(/^--unchanged\s*/, ''));
            if (fileData) {
                unchangedFiles.push(fileData);
            }
        }
    });

    return { changedFiles, unchangedFiles };
}

/**
 * Extracts the file path and code from a section.
 * @param {string} section - A section of the result.txt file.
 * @returns {Object|null} An object containing the relative path and code, or null if parsing fails.
 */
function extractFileData(section) {
    // Match the filename
    const filePathMatch = section.match(/^---\s+(.+?)\s+---/m);
    if (!filePathMatch) {
        console.warn('Warning: Could not find file path in section:', section);
        return null;
    }
    const relativeFilePath = filePathMatch[1].trim();

    // Match the code block
    const codeBlockMatch = section.match(/```(\w+)?\n([\s\S]*?)```/m);
    if (!codeBlockMatch) {
        console.warn(`Warning: Code block not found for file ${relativeFilePath}. Skipping.`);
        return null;
    }
    const language = codeBlockMatch[1] || ''; // e.g., 'jsx' or 'css'
    const code = codeBlockMatch[2].trim();

    return {
        relativePath: relativeFilePath,
        language: language.toLowerCase(),
        code: code,
    };
}

/**
 * Writes the new content to the specified file, creating directories if necessary.
 * @param {string} baseDir - The base directory where files should be updated.
 * @param {string} relativePath - The relative path to the file from the base directory.
 * @param {string} content - The new content to write to the file.
 */
function writeFile(baseDir, relativePath, content) {
    const fullPath = path.join(baseDir, relativePath);
    const dirName = path.dirname(fullPath);

    // Create directories if they don't exist
    fs.mkdirSync(dirName, { recursive: true });

    // Write the new content to the file
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${fullPath}`);
}

/**
 * Logs unchanged files.
 * @param {string} baseDir - The base directory where files are located.
 * @param {Array} unchangedFiles - Array of unchanged file objects.
 */
function logUnchangedFiles(baseDir, unchangedFiles) {
    unchangedFiles.forEach(file => {
        const fullPath = path.join(baseDir, file.relativePath);
        console.log(`--unchanged: ${fullPath}`);
    });
}

/**
 * Main function to process the result.txt and update files.
 */
function processResult() {
    // Get the last selected folder
    const lastFolder = getLastFolder();
    if (!lastFolder || !fs.existsSync(lastFolder)) {
        console.error('Error: The last selected folder does not exist.');
        process.exit(1);
    }

    // Read the result.txt content
    if (!fs.existsSync(resultFilePath)) {
        console.error(`Error: ${resultFilePath} does not exist.`);
        process.exit(1);
    }

    const resultContent = fs.readFileSync(resultFilePath, 'utf8');

    // Parse the result content
    const { changedFiles, unchangedFiles } = parseResult(resultContent);

    if (changedFiles.length === 0 && unchangedFiles.length === 0) {
        console.log('No files found in result.txt.');
        return;
    }

    // Update each changed file
    changedFiles.forEach(file => {
        writeFile(lastFolder, file.relativePath, file.code);
    });

    // Log unchanged files
    if (unchangedFiles.length > 0) {
        logUnchangedFiles(lastFolder, unchangedFiles);
    }

    console.log('\nAll changed files have been processed successfully.');
}

// Execute the main function
processResult();
