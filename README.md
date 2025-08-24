# Honeycomb Website

A modern, interactive website featuring a honeycomb grid layout with clickable cells and zoom functionality.

## Features

- **Honeycomb Grid Layout**: Beautiful hexagonal grid pattern with orange wireframes
- **Black Background**: Sleek dark theme for modern aesthetics
- **Clickable Cells**: Some honeycomb cells are interactive and clickable
- **Zoom Functionality**: Click on clickable cells to zoom into a detailed honeycomb view
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant entrance animations and hover effects

## How to Use

1. **Open the Website**: Open `index.html` in your web browser
2. **Navigate the Grid**: The main page displays a honeycomb grid with various cells
3. **Identify Clickable Cells**: Clickable cells have brighter orange borders and show "Click X-Y" text
4. **Click to Zoom**: Click on any clickable cell to open a detailed zoom view
5. **Close Zoom View**: Use the × button, click outside the content, or press ESC key

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - CSS styling for honeycomb layout and animations
- `script.js` - JavaScript functionality for grid generation and interactions
- `README.md` - This documentation file

## Customization

### Making Cells Clickable
Edit the `isClickableCell(row, col)` function in `script.js` to change which cells are interactive.

### Changing Colors
Modify the CSS variables in `styles.css`:
- Main orange: `#ff6600`
- Hover orange: `#ff8533`
- Background: `#000`

### Grid Size
Adjust the `rows` and `cols` variables in the `generateMainHoneycomb()` function to change the grid dimensions.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Responsive Design

The website automatically adjusts for different screen sizes:
- Desktop: Full-size honeycomb cells
- Tablet: Medium-sized cells
- Mobile: Compact cells for touch interaction

## Performance

- Optimized CSS with hardware acceleration
- Efficient JavaScript event handling
- Smooth animations with CSS transitions
- Minimal DOM manipulation

Enjoy exploring the honeycomb website!
