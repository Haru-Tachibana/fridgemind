# FridgeMind 🧊

A minimalistic web app that helps users track groceries, reduce food waste, and get recipe suggestions.

## Features

### 🛒 Grocery Management
- **Manual Input**: Simple form to add items with name, category, quantity, and expiry date
- **Voice Input**: Press and hold the microphone button to speak groceries (e.g., "2 cartons of milk, 1 broccoli")
- **Smart Categorization**: Automatically categorizes items and estimates expiry dates
- **Visual Organization**: Clean, sortable list with category icons and color coding

### 🍳 Recipe Suggestions
- **AI-Powered Recommendations**: Get recipe suggestions based on available ingredients
- **Missing Ingredients**: Shows what additional items you need for each recipe
- **Smart Filtering**: Filter by meal type, dietary preferences, and cooking time
- **Availability Status**: Visual indicators for recipes you can make right now

### 📝 Shopping List
- **Must-Have Items**: Mark essential items that auto-add when stock is low
- **Export Functionality**: Export your shopping list as text or email
- **Category Organization**: Items organized by food categories with visual icons
- **Smart Notifications**: Get notified when must-have items are missing

### 🔔 Smart Notifications
- **Expiry Warnings**: Get notified when items are expiring within 3 days (configurable)
- **Low Stock Alerts**: Notifications when items are running low
- **Must-Have Reminders**: Alerts when essential items are missing from your fridge
- **Customizable Settings**: Adjust notification preferences in settings

## Design

- **Minimalist UI**: Clean, flat design with pastel accent colors
- **Mobile-First**: Responsive design optimized for mobile devices
- **Intuitive Navigation**: Simple 3-tab interface (Fridge, Recipes, Shopping)
- **Accessibility**: High contrast colors and clear typography

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for minimalistic design
- **State Management**: React hooks and local storage
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for reliable date operations
- **Notifications**: Web Push API for smart alerts

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fridgemind
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Usage

### Adding Groceries
1. Tap the floating "+" button
2. Enter item name manually or use voice input
3. Select category and set quantity/expiry date
4. Tap "Add Item"

### Managing Your Fridge
- **Sort**: By expiry date, category, or name
- **Filter**: By food category
- **Remove**: Tap the "-" button and confirm
- **Track**: Visual indicators for expiring items

### Getting Recipe Ideas
- View suggested recipes based on your ingredients
- Filter by meal type or dietary preferences
- See which recipes you can make right now
- Check what additional ingredients you need

### Shopping List Management
- Add items manually or from low-stock alerts
- Mark items as "must-have" for auto-adding
- Export your list for shopping
- Organize by category for efficient shopping

## Data Storage

FridgeMind stores all data locally in your browser using localStorage. This means:
- ✅ Your data stays private and secure
- ✅ Works offline
- ✅ No account required
- ⚠️ Data is tied to your specific browser/device

### Data Export/Import
- Export your data as JSON from Settings
- Clear all data if needed
- Backup your data regularly for safety

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Receipt photo upload with OCR
- [ ] Cloud sync across devices
- [ ] Advanced recipe search
- [ ] Meal planning features
- [ ] Barcode scanning
- [ ] Social sharing
- [ ] Multi-language support

---

Built with ❤️ for reducing food waste and making meal planning easier.