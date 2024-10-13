// prebuildChecks.js

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Directory to check
const srcDirectory = path.join(__dirname, 'src');
// Maximum allowed lines per file
const MAX_LINES = 200;

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
 * Calculates the average number of lines given total lines and file count.
 * @param {number} totalLines - The sum of lines across all files.
 * @param {number} fileCount - The number of files.
 * @returns {number} - The average number of lines.
 */
function calculateAverage(totalLines, fileCount) {
  if (fileCount === 0) return 0;
  return (totalLines / fileCount).toFixed(2);
}

/**
 * Runs the pre-build checks, including line count validations and average calculations.
 */
function runPrebuildChecks() {
  try {
    const allFiles = getAllFiles(srcDirectory);
    const oversizedFiles = [];

    // Initialize counters for averages
    let totalLinesAll = 0;
    let countAll = 0;

    let totalLinesJS = 0;
    let countJS = 0;

    let totalLinesIndexJS = 0;
    let countIndexJS = 0;

    allFiles.forEach((file) => {
      const ext = path.extname(file).toLowerCase();

      // Only consider .js and .css files for averages
      if (ext === '.js' || ext === '.css') {
        const content = fs.readFileSync(file, 'utf-8');
        const lineCount = content.split('\n').length;

        // Update overall counters
        totalLinesAll += lineCount;
        countAll += 1;

        // If it's a .js file, update JS counters
        if (ext === '.js') {
          totalLinesJS += lineCount;
          countJS += 1;

          // If it's an index.js file, update index.js counters
          if (path.basename(file).toLowerCase() === 'index.js') {
            totalLinesIndexJS += lineCount;
            countIndexJS += 1;
          }
        }

        // Check if the file exceeds the maximum line limit
        if (!shouldSkipFile(file) && lineCount > MAX_LINES) {
          const relativePath = path.relative(__dirname, file);
          oversizedFiles.push(relativePath);
        }
      }
    });

    // Calculate averages
    const averageAll = calculateAverage(totalLinesAll, countAll);
    const averageJS = calculateAverage(totalLinesJS, countJS);
    const averageIndexJS = calculateAverage(totalLinesIndexJS, countIndexJS);

    // Display the calculated averages
    console.log(chalk.blue.bold('\n===== Average Code Lengths ====='));
    console.log(
      `Average number of lines in .js and .css files: ${chalk.yellow(averageAll)}`
    );
    console.log(
      `Average number of lines in .js files: ${chalk.yellow(averageJS)}`
    );
    console.log(
      `Average number of lines in index.js files: ${chalk.yellow(averageIndexJS)}`
    );
    console.log(chalk.blue.bold('================================\n'));

    // Handle oversized files
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
          `Pre-build check passed: All .js and .css files in '${path.relative(
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
