const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Directory to check
const srcDirectory = path.join(__dirname, 'src');
// Maximum allowed lines per file
const MAX_LINES = 190;

/**
 * Recursively retrieves all files in the given directory.
 * @param {string} dir - The directory path.
 * @param {Array} arrayOfFiles - Accumulator for file paths.
 * @returns {Array} - List of file paths.
 */
function getAllFiles(dir, arrayOfFiles) {
  const files = fs.readdirSync(dir);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Checks if a file exceeds the maximum number of lines.
 * @param {string} filePath - The path to the file.
 * @returns {boolean} - True if the file exceeds the line limit, else false.
 */
function checkFileLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lineCount = content.split('\n').length;
  return lineCount > MAX_LINES;
}

/**
 * Checks if a file should be skipped based on its extension.
 * @param {string} filePath - The path to the file.
 * @returns {boolean} - True if the file should be skipped, else false.
 */
function shouldSkipFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.webp' || ext === '.jpg';
}

/**
 * Runs the pre-build checks.
 */
function runPrebuildChecks() {
  try {
    const allFiles = getAllFiles(srcDirectory);
    const oversizedFiles = [];

    allFiles.forEach((file) => {
      if (!shouldSkipFile(file) && checkFileLines(file)) {
        const relativePath = path.relative(__dirname, file);
        oversizedFiles.push(relativePath);
      }
    });

    if (oversizedFiles.length > 0) {
      console.error(
        chalk.red.bold(
          `Build halted: The following file(s) exceed ${MAX_LINES} lines:\n` +
            oversizedFiles.map((f) => `- ${f}`).join('\n')
        )
      );
      process.exit(1);
    } else {
      console.log(
        chalk.green.bold(
          `Pre-build check passed: All files in '${path.relative(
            __dirname,
            srcDirectory
          )}' have ${MAX_LINES} lines or fewer.`
        )
      );
    }
  } catch (err) {
    console.error(chalk.red.bold(`Error during pre-build checks: ${err.message}`));
    process.exit(1);
  }
}

runPrebuildChecks();
