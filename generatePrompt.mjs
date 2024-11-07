// generatePrompt.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively traverses a directory and builds a directory tree.
 * @param {string} dir - The directory to traverse.
 * @param {string} prefix - The prefix for formatting.
 * @returns {string} - The formatted directory tree.
 */
function buildDirectoryTree(dir, prefix = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    let tree = '';

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        tree += `${prefix}${pointer}${item.name}\n`;

        if (item.isDirectory()) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            tree += buildDirectoryTree(path.join(dir, item.name), newPrefix);
        }
    });

    return tree;
}

/**
 * Recursively collects all files in a directory.
 * @param {string} dir - The directory to traverse.
 * @param {string} baseDir - The base directory for relative paths.
 * @param {Array} fileList - The accumulator for file paths.
 * @returns {Array} - The list of file paths.
 */
function collectFiles(dir, baseDir, fileList = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    items.forEach(item => {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(baseDir, fullPath);
        if (item.isDirectory()) {
            collectFiles(fullPath, baseDir, fileList);
        } else {
            fileList.push(relativePath);
        }
    });

    return fileList;
}

/**
 * Reads and returns the content of each file in the specified folder.
 * @param {Array} files - The list of file paths.
 * @param {string} baseDir - The base directory for relative paths.
 * @returns {string} - The concatenated content of all files.
 */
function getFileContents(files, baseDir) {
    let content = '';
    files.forEach(file => {
        const filePath = path.join(baseDir, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        content += `\n--- ${file} ---\n${fileData}\n`;
    });
    return content;
}

/**
 * Main function to generate the prompt.
 */
async function generatePrompt() {
    const srcPath = path.join(__dirname, 'src');

    // Check if src directory exists
    if (!fs.existsSync(srcPath)) {
        console.error('Error: "src" directory does not exist.');
        process.exit(1);
    }

    // Build and display the directory tree
    console.log('DIRECTORY STRUCTURE OF src:\n');
    const directoryTree = buildDirectoryTree(srcPath);
    console.log(directoryTree);

    // Get the list of top-level folders in src
    const topLevelItems = fs.readdirSync(srcPath, { withFileTypes: true });
    const folders = topLevelItems.filter(item => item.isDirectory()).map(folder => folder.name);

    if (folders.length === 0) {
        console.log('No folders found in src.');
        process.exit(0);
    }

    // Prompt the user to select a folder, defaulting to "Pages"
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedFolder',
            message: 'What folder do you want to generate a prompt for?',
            choices: folders,
            default: 'Pages',
        },
    ]);

    const selectedFolderPath = path.join(srcPath, answers.selectedFolder);

    // Get subfolders within the selected folder
    const subItems = fs.readdirSync(selectedFolderPath, { withFileTypes: true });
    const subFolders = subItems.filter(item => item.isDirectory()).map(subFolder => subFolder.name);

    // Prompt the user to select a subfolder, if any are available
    let selectedSubfolderPath = selectedFolderPath;
    if (subFolders.length > 0) {
        const subAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedSubfolder',
                message: `Select a subfolder in "${answers.selectedFolder}" to generate a prompt for:`,
                choices: subFolders,
            },
        ]);

        selectedSubfolderPath = path.join(selectedFolderPath, subAnswer.selectedSubfolder);
    }

    // Build the directory tree for the selected (sub)folder
    const selectedDirectoryTree = buildDirectoryTree(selectedSubfolderPath);

    // Collect all files in the selected (sub)folder
    const allFiles = collectFiles(selectedSubfolderPath, selectedSubfolderPath);

    // Read the content of each file
    const fileContents = getFileContents(allFiles, selectedSubfolderPath);

    // Prepare the prompt content
    let promptContent = `File Contents:\n${fileContents}\n\nDirectory Structure for "${selectedSubfolderPath}":\n\n${selectedDirectoryTree}\n\nList of Files:\n${allFiles.join('\n')}`;

    // Determine the encapsulating class based on folder selection
    const isPagesFolder = answers.selectedFolder.toLowerCase() === 'pages';
    const encapsulatingClass = isPagesFolder ? '.component-name-page' : '.component-name-component';

    // Append fixed instructions based on folder selection
    if (isPagesFolder) {
        promptContent += `\n\n**Instruction:**\n1. Please encapsulate the main component in index.js inside the \`${encapsulatingClass}\` class.\n2. Prefix all CSS classes with the \`${encapsulatingClass}\` class.\n\n**Examples:**\n\n*Encapsulation in index.js:*\n\`\`\`jsx\n<div className="profile-page">\n    <h2 className="account-manage-title">Admin Reservaties</h2>\n    <div className="account-manage-container">\n        {/* ... */}\n        onClose={() => setIsModalOpen(false)}\n    </div>\n</div>\n\`\`\`\n\n*Prefixed CSS Classes:*\n\`\`\`css\n.profile-page .account-manage-container {\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n    position: relative;\n    width: 100%;\n    max-width: 600px;\n    text-align: center;\n    background-color: white;\n}\n\n.profile-page .modal-title {\n    text-align: center;\n    width: 100%;\n    margin-top: 20px;\n    margin-bottom: 40px;\n}\n\`\`\``;
    } else {
        promptContent += `\n\n**Instruction:**\n1. Please encapsulate the main component in index.js inside the \`${encapsulatingClass}\` class.\n2. Prefix all CSS classes with the \`${encapsulatingClass}\` class.\n\n**Examples:**\n\n*Encapsulation in index.js:*\n\`\`\`jsx\n<div className="profile-component">\n    <h2 className="account-manage-title">Admin Reservaties</h2>\n    <div className="account-manage-container">\n        {/* ... */}\n        onClose={() => setIsModalOpen(false)}\n    </div>\n</div>\n\`\`\`\n\n*Prefixed CSS Classes:*\n\`\`\`css\n.component-name-component .account-manage-container {\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n    position: relative;\n    width: 100%;\n    max-width: 600px;\n    text-align: center;\n    background-color: white;\n}\n\n.component-name-component .modal-title {\n    text-align: center;\n    width: 100%;\n    margin-top: 20px;\n    margin-bottom: 40px;\n}\n\`\`\``;
    }

    promptContent += "Sometimes the encapsulation is already done, and we don't need to do it twice. Don't write any comments. Delete all commments and don't write any extra comments."

    // Write the prompt to a text file
    const outputFilePath = path.join(__dirname, `${path.basename(selectedSubfolderPath)}-prompt.txt`);
    fs.writeFileSync(outputFilePath, promptContent, 'utf8');

    console.log(`\nPrompt generated successfully at ${outputFilePath}`);
}

// Execute the main function
generatePrompt();
