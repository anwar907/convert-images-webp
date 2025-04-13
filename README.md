# Convert-img

A simple tool to optimize and convert images to WebP format.

## Features

- Convert images to WebP format
- Optimize image sizes
- Automatic thumbnail generation
- Supports formats: JPG, JPEG, PNG, WebP

## Installation

```bash
npm install
```

## Usage

1. Place your images in the `assets/images` folder
2. Run the program:

```bash
npm start
```

3. Optimized images will be saved in `assets/images/optimized`

## Configuration

You can modify the following settings in `convert-img.js`:

- `ASSETS_DIR`: Source directory for images
- `OUTPUT_DIR`: Output directory
- WebP quality (default: 80)
- Maximum image dimensions (default: 1920x1080)
- Thumbnail size (default: 400x300)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
