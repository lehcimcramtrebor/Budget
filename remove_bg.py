import sys
from PIL import Image

def remove_checkerboard(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.load()
    width, height = img.size
    
    # Get the two colors of the checkerboard from the top-left corner
    # The checkerboard is usually a grid, so we can sample (0,0) and say (10,10) or find the two dominant colors in the background
    # Actually, we can just look at the top left 32x32 pixels which should be pure background
    bg_colors = set()
    for x in range(32):
        for y in range(32):
            r, g, b, a = data[x, y]
            if a > 0:
                bg_colors.add((r, g, b))
                
    print("Found background colors:", bg_colors)
    
    # Tolerance for color matching
    tol = 15
    
    def match(c1, c2):
        return abs(c1[0]-c2[0]) < tol and abs(c1[1]-c2[1]) < tol and abs(c1[2]-c2[2]) < tol

    for y in range(height):
        for x in range(width):
            r, g, b, a = data[x, y]
            is_bg = False
            for bc in bg_colors:
                if match((r, g, b), bc):
                    is_bg = True
                    break
            if is_bg:
                data[x, y] = (0, 0, 0, 0)
                
    img.save(out_path)
    print("Saved transparent image to", out_path)

if __name__ == "__main__":
    remove_checkerboard(sys.argv[1], sys.argv[2])
