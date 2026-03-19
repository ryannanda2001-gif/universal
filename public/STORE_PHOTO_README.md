# Store Photo Instructions

To add your store photo:

1. Save your store photo as `store-photo.jpg` (or any image format: .jpg, .png, .webp)
2. Place the image file in the `public/` folder of your Next.js project
3. The image will automatically be used in the store location section

## Recommended Image Specifications:
- **Format**: JPG, PNG, or WebP
- **Size**: At least 800x600 pixels (16:9 aspect ratio recommended)
- **File size**: Under 2MB for optimal loading speed
- **Content**: Clear photo of your store exterior or interior

## Alternative Image Names:
If you prefer a different filename, update the `src` attribute in `app/page.tsx`:
```tsx
src="/your-image-name.jpg"
```

The code includes automatic fallback to the emoji placeholder if the image file is not found.