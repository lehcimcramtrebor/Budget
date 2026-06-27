const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Compiling Tailwind CSS...');
try {
    execSync('npm run build:css', { stdio: 'inherit' });
    console.log('Tailwind CSS compiled successfully.');
} catch (err) {
    console.error('Error compiling Tailwind CSS:', err.message);
    process.exit(1);
}

const srcDir = path.join(__dirname, 'src');
const wwwDir = path.join(__dirname, 'www');
const docsDir = path.join(__dirname, 'docs');

const filesToCopy = [
    'index.html',
    'app.js',
    'manifest.json',
    'robots.txt',
    'sitemap.xml',
    'sw.js',
    'icon.svg',
    'google8ff5eebdaef4d9d9.html'
];

const dirsToCopy = [
    'assets',
    'components',
    'config',
    'services',
    'store',
    'utils'
];

// Helper to clean and recreate directory contents
function prepareDir(dir) {
    if (fs.existsSync(dir)) {
        try {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const curPath = path.join(dir, file);
                try {
                    fs.rmSync(curPath, { recursive: true, force: true });
                } catch (err) {
                    console.warn(`Warning: could not delete ${file} in ${path.basename(dir)}:`, err.message);
                }
            });
        } catch (err) {
            console.warn(`Warning: could not read directory ${dir}:`, err.message);
        }
    } else {
        fs.mkdirSync(dir, { recursive: true });
    }
}

prepareDir(wwwDir);
prepareDir(docsDir);

// Helper function to copy files
function copyAppFiles(targetDir) {
    filesToCopy.forEach(file => {
        const src = path.join(srcDir, file);
        const dest = path.join(targetDir, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${file} to ${path.basename(targetDir)}`);
        } else {
            console.warn(`Warning: file ${file} not found in src!`);
        }
    });
}

// Helper function to copy folder recursively
function copyFolderRecursiveSync(source, target) {
    let files = [];
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }

    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                fs.copyFileSync(curSource, path.join(targetFolder, file));
            }
        });
    }
}

// Copy directories
function copyAppDirs(targetDir) {
    dirsToCopy.forEach(dir => {
        const src = path.join(srcDir, dir);
        if (fs.existsSync(src)) {
            copyFolderRecursiveSync(src, targetDir);
            console.log(`Copied directory ${dir} to ${path.basename(targetDir)}`);
        } else {
            console.warn(`Warning: directory ${dir} not found in src!`);
        }
    });
}

// Execute copies for both targets
copyAppFiles(wwwDir);
copyAppDirs(wwwDir);

copyAppFiles(docsDir);
copyAppDirs(docsDir);

// Copy APK if it exists in src to docs (Web distribution)
const srcApk = path.join(srcDir, 'BUDGET-HMR.APK');
const destApk = path.join(docsDir, 'BUDGET-HMR.APK');
if (fs.existsSync(srcApk)) {
    fs.copyFileSync(srcApk, destApk);
    console.log('Copied BUDGET-HMR.APK to docs for web distribution.');
} else {
    console.log('Notice: BUDGET-HMR.APK not found in src. Skipping APK web copy.');
}

console.log('Build completed successfully.');
