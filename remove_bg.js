const { Jimp } = require("jimp");

async function removeBackground() {
    const imagePath = "src/assets/burning_pixel_card.png";
    console.log("Loading image...", imagePath);
    const image = await Jimp.read(imagePath);
    
    // Sample a few pixels in the top-left corner to get the checkerboard colors
    const bgColors = [];
    for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
            const hex = image.getPixelColor(x, y);
            const r = (hex >> 24) & 255;
            const g = (hex >> 16) & 255;
            const b = (hex >> 8) & 255;
            const colorStr = `${r},${g},${b}`;
            if (!bgColors.includes(colorStr)) {
                bgColors.push(colorStr);
            }
        }
    }
    
    console.log("Found background colors:", bgColors);
    
    const tolerance = 25;
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        let isBg = false;
        for (const bc of bgColors) {
            const [bcr, bcg, bcb] = bc.split(",").map(Number);
            if (Math.abs(r - bcr) < tolerance && Math.abs(g - bcg) < tolerance && Math.abs(b - bcb) < tolerance) {
                isBg = true;
                break;
            }
        }
        
        if (isBg) {
            this.bitmap.data[idx + 3] = 0; // alpha to 0
        }
    });
    
    await image.write(imagePath);
    console.log("Done!");
}

removeBackground().catch(console.error);
