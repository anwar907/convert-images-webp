const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const ASSETS_DIR = 'assets/images';
const OUTPUT_DIR = 'assets/images/optimized';

/**
 * Creates the output directory if it doesn't exist
 * @async
 * @throws {Error} If there's an error other than EEXIST
 */
async function createOutputDir() {
    try {
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

/**
 * Optimizes an image and converts it to WebP format
 * @async
 * @param {string} filePath - Path to the image file to be optimized
 */
async function optimizeImage(filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();
    
    // Skip if already optimized
    if (filePath.includes('optimized')) return;
    
    // Supported image formats
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!supportedFormats.includes(ext)) return;
    
    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        // Convert to WebP with reduced quality
        const webpOutput = path.join(OUTPUT_DIR, `${path.parse(fileName).name}.webp`);
        await image
            .webp({ 
                quality: 80,
                effort: 6, // 0 (fastest) to 6 (best)
            })
            .resize({
                width: Math.min(metadata.width, 1920),
                height: Math.min(metadata.height, 1080),
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFile(webpOutput);
        
        console.log(`✓ Optimized: ${fileName} -> ${path.basename(webpOutput)}`);
        
        // Create thumbnail version if needed
        if (metadata.width > 400) {
            const thumbOutput = path.join(OUTPUT_DIR, `${path.parse(fileName).name}-thumb.webp`);
            await image
                .webp({ quality: 80 })
                .resize(400, 300, {
                    fit: 'cover',
                    position: 'center'
                })
                .toFile(thumbOutput);
            console.log(`  ↳ Created thumbnail: ${path.basename(thumbOutput)}`);
        }
    } catch (err) {
        console.error(`✗ Error processing ${fileName}:`, err.message);
    }
}

/**
 * Recursively walks through a directory and processes images
 * @async
 * @param {string} dir - Directory path to process
 */
async function walkDir(dir) {
    try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                await walkDir(filePath);
            } else {
                await optimizeImage(filePath);
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${dir}:`, err.message);
    }
}

async function main() {
    console.log('🔍 Starting image optimization...');
    console.log(`Source directory: ${ASSETS_DIR}`);
    console.log(`Output directory: ${OUTPUT_DIR}`);
    
    try {
        await createOutputDir();
        await walkDir(ASSETS_DIR);
        console.log('\n✨ Image optimization complete!');
    } catch (err) {
        console.error('\n❌ Error during optimization:', err.message);
        process.exit(1);
    }
}

main();
