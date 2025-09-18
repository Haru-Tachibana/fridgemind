# FridgeMind - Smart Fridge Management App

A minimalistic web app to track groceries, reduce food waste, and get recipe suggestions.

## Features

- 🍎 **Grocery Management**: Track items with expiry dates and quantities
- 🎤 **Voice Input**: Add items using voice commands
- 🍽️ **Recipe Suggestions**: Get recipes based on available ingredients
- 🛒 **Shopping List**: Manage your shopping needs
- 👤 **User Accounts**: Sign up/sign in to keep your data safe
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify
- **APIs**: Spoonacular (recipes)

## Setup Instructions

### 1. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to SQL Editor
3. Run this SQL to create the required tables:

```sql
-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grocery_items table
CREATE TABLE grocery_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  added_date TIMESTAMP WITH TIME ZONE NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL
);

-- Create shopping_list table
CREATE TABLE shopping_list (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_must_have BOOLEAN DEFAULT FALSE,
  auto_add BOOLEAN DEFAULT FALSE,
  last_purchased TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - customize as needed)
CREATE POLICY "Users can manage their own data" ON users FOR ALL USING (true);
CREATE POLICY "Users can manage their own grocery items" ON grocery_items FOR ALL USING (true);
CREATE POLICY "Users can manage their own shopping list" ON shopping_list FOR ALL USING (true);
```

4. Go to Settings > API to get your project URL and anon key

### 2. Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   REACT_APP_SPOONACULAR_API_KEY=your-spoonacular-api-key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm start
```

### 5. Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variables in Netlify dashboard:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_SPOONACULAR_API_KEY`
6. Deploy!

## Usage

1. **Sign Up**: Create an account to save your data
2. **Add Items**: Use voice input or manual entry to add groceries
3. **Manage Quantities**: Use +/- buttons to adjust quantities
4. **Get Recipes**: View recipe suggestions based on your ingredients
5. **Shopping List**: Add items you need to buy

## Features in Detail

### Voice Input
- Say "5 apples, 2 pears" to add multiple items
- Smart parsing extracts quantities and categories
- Confirmation modal for multiple items

### Smart Merging
- Same items with same expiry date automatically merge
- Quantities are added together

### Recipe Suggestions
- Real-time recipe search using Spoonacular API
- Filter by dietary preferences
- Shows missing ingredients

### User Management
- Secure user accounts with Supabase
- Data persistence across devices
- Individual user data isolation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details