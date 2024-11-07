// generatePrompt.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configFilePath = path.join(__dirname, 'prompts/lastFolder.json');

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

function getFileContents(files, baseDir) {
    let content = '';
    files.forEach(file => {
        const filePath = path.join(baseDir, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        content += `\n--- ${file} ---\n${fileData}\n`;
    });
    return content;
}

function saveLastFolder(folderPath) {
    const data = { lastFolder: folderPath };
    fs.writeFileSync(configFilePath, JSON.stringify(data), 'utf8');
}

function getLastFolder() {
    if (fs.existsSync(configFilePath)) {
        const data = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
        return data.lastFolder || null;
    }
    return null;
}

async function generatePrompt() {
    const srcPath = path.join(__dirname, 'src');
    if (!fs.existsSync(srcPath)) {
        console.error('Error: "src" directory does not exist.');
        process.exit(1);
    }
    const args = process.argv.slice(2);
    const hasCParameter = args.includes('c');

    let selectedFolderPath;

    if (!hasCParameter) {
        const lastFolder = getLastFolder();
        if (lastFolder && fs.existsSync(lastFolder)) {
            selectedFolderPath = lastFolder;
            console.log(`Using the last selected folder: ${selectedFolderPath}\n`);
        } else {
            selectedFolderPath = await promptForFolder(srcPath);
        }
    } else {
        selectedFolderPath = await promptForFolder(srcPath);
    }
    saveLastFolder(selectedFolderPath);
    const selectedDirectoryTree = buildDirectoryTree(selectedFolderPath);
    const allFiles = collectFiles(selectedFolderPath, selectedFolderPath);
    const fileContents = getFileContents(allFiles, selectedFolderPath);
    let promptContent = `File Contents:\n${fileContents}\n\nDirectory Structure for "${selectedFolderPath}":\n\n${selectedDirectoryTree}\n\nList of Files:\n${allFiles.join('\n')}`;

    const selectedFolderName = path.basename(selectedFolderPath);
    const isPagesFolder = selectedFolderName.toLowerCase() === 'pages';
    const encapsulatingClass = isPagesFolder ? '.component-name-page' : '.component-name-component';

    if (isPagesFolder) {
        promptContent += `\n\n**Instruction:**\n1. Please encapsulate the main component in index.js inside the \`${encapsulatingClass}\` class.\n2. Prefix all CSS classes with the \`${encapsulatingClass}\` class.\n\n**Examples:**\n\n*Encapsulation in index.js:*\n\`\`\`jsx\n<div className="profile-page">\n    <h2 className="account-manage-title">Admin Reservaties</h2>\n    <div className="account-manage-container">\n        {/* ... */}\n        onClose={() => setIsModalOpen(false)}\n    </div>\n</div>\n\`\`\`\n\n*Prefixed CSS Classes:*\n\`\`\`css\n.profile-page .account-manage-container {\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n    position: relative;\n    width: 100%;\n    max-width: 600px;\n    text-align: center;\n    background-color: white;\n}\n\n.profile-page .modal-title {\n    text-align: center;\n    width: 100%;\n    margin-top: 20px;\n    margin-bottom: 40px;\n}\n\`\`\``;
    } else {
        promptContent += `\n\n**Instruction:**\n1. Please encapsulate the main component in index.js inside the \`${encapsulatingClass}\` class.\n2. Prefix all CSS classes with the \`${encapsulatingClass}\` class.\n\n**Examples:**\n\n*Encapsulation in index.js:*\n\`\`\`jsx\n<div className="profile-component">\n    <h2 className="account-manage-title">Admin Reservaties</h2>\n    <div className="account-manage-container">\n        {/* ... */}\n        onClose={() => setIsModalOpen(false)}\n    </div>\n</div>\n\`\`\`\n\n*Prefixed CSS Classes:*\n\`\`\`css\n.component-name-component .account-manage-container {\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n    position: relative;\n    width: 100%;\n    max-width: 600px;\n    text-align: center;\n    background-color: white;\n}\n\n.component-name-component .modal-title {\n    text-align: center;\n    width: 100%;\n    margin-top: 20px;\n    margin-bottom: 40px;\n}\n\`\`\``;
    }

    promptContent += "Sometimes the encapsulation is already done, and we don't need to do it twice. Don't write any comments. Delete all comments and don't write any extra comments.";
    promptContent += "Only print the code with changes. Print the codes in full. Don't skip anything print them full.";
    promptContent += "Mark all changed files with CHANGED before printing the file else mark them with --unchanged and don't print them.";
    promptContent += "Only print every file once.";


    const outputFilePath = path.join(__dirname, `prompts/${path.basename(selectedFolderPath)}-prompt.txt`);
    fs.writeFileSync(outputFilePath, promptContent, 'utf8');

    console.log(`\nPrompt generated successfully at ${outputFilePath}`);
}

async function promptForFolder(srcPath) {
    console.log('DIRECTORY STRUCTURE OF src:\n');
    const directoryTree = buildDirectoryTree(srcPath);
    console.log(directoryTree);
    const topLevelItems = fs.readdirSync(srcPath, { withFileTypes: true });
    const folders = topLevelItems.filter(item => item.isDirectory()).map(folder => folder.name);

    if (folders.length === 0) {
        console.log('No folders found in src.');
        process.exit(0);
    }
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
    const subItems = fs.readdirSync(selectedFolderPath, { withFileTypes: true });
    const subFolders = subItems.filter(item => item.isDirectory()).map(subFolder => subFolder.name);
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

    return selectedSubfolderPath;
}

generatePrompt();
