#!/bin/bash

echo "🚀 Supabase Setup Script"
echo "========================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials:"
    echo "   1. Go to https://supabase.com"
    echo "   2. Create a new project"
    echo "   3. Get your URL and API keys from Settings → API"
    echo "   4. Update .env.local with your values"
    echo ""
    echo "Press Enter when you've updated .env.local..."
    read
fi

# Check if dependencies are installed
echo "📦 Installing dependencies..."
npm install @supabase/supabase-js tsx
echo "✅ Dependencies installed"
echo ""

# Remind about schema
echo "📊 Database Schema Setup"
echo "========================"
echo "Before generating data, you need to create the database schema:"
echo ""
echo "1. Go to your Supabase dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Click 'New query'"
echo "4. Copy the contents of supabase/schema.sql"
echo "5. Paste and click 'Run'"
echo ""
echo "Have you created the schema? (y/n)"
read -r response

if [[ "$response" != "y" ]]; then
    echo ""
    echo "⚠️  Please create the schema first, then run this script again."
    echo "   Or run: npm run generate-data"
    exit 0
fi

# Generate data
echo ""
echo "🎲 Generating synthetic data..."
echo "This will take 2-3 minutes..."
echo ""
npm run generate-data

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Visit: http://localhost:3000/dashboard"
echo "  3. See your real data!"
