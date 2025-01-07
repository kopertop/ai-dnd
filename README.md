# D&D Game Interface

An AI-powered D&D game interface that helps manage campaigns, characters, and combat encounters.

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- [Together.ai](https://together.ai) account for AI functionality

### Environment Setup

Create a `.env` file in the root directory with the following:

TOGETHER_API_KEY=your_api_key_here

You can get your API key by:
1. Creating an account at [Together.ai](https://together.ai)
2. Going to your account settings
3. Generating a new API key

### Installation

```
git clone https://github.com/yourusername/ai-dnd.git
```

# Navigate to project directory
```
cd ai-dnd
```

# Install dependencies
```
npm install
```

# Start the development server

```
npm run dev
```

The app will be available at http://localhost:5173

## Development

### Project Structure

```
src/
├── components/     # React components
│   ├── cards/     # Card-based components
│   ├── game-menu/ # Game menu components
│   └── shared/    # Shared components
├── schemas/       # TypeScript schemas and types
├── server/        # Backend API and AI integration
├── stores/        # State management
└── utils/         # Utility functions
```

### Key Features

- Character creation and management
- AI-powered campaign generation
- Dynamic inventory system
- Turn-based combat system
- Real-time AI chat interface

### Tech Stack

- React 18 + TypeScript
- Vite for development and building
- React Bootstrap for UI components
- Zustand for state management
- Together.ai for LLM integration
- Hono for API routing

### Scripts

npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking

### Development Notes

- Use tabs for indentation
- Use single quotes for strings
- Use kebab-case for file names
- Write TypeScript where possible
- Follow React Bootstrap patterns for UI components

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your Together.ai API key is correctly set in `.env`
   - Check that the key has sufficient credits/permissions

2. **Build Errors**
   - Run `npm run type-check` to find type issues
   - Ensure all dependencies are installed with `npm install`

3. **Development Server**
   - Default port is 5173
   - Check for port conflicts
   - Ensure Node.js version is 18+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details
