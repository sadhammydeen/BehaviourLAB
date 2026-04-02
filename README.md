# BehaviourLab

A modern, full-featured web application built with Next.js and TypeScript, designed for advanced behavioral analysis and data visualization.

## Overview

BehaviourLab provides a comprehensive suite of tools for analyzing behavioral patterns, generating insights, and presenting data through intuitive, interactive interfaces. Built on cutting-edge web technologies, the platform delivers a seamless user experience with responsive design and high-performance interactions.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org) - React-based server-side rendering and static site generation
- **Language**: TypeScript - Type-safe development with enhanced code quality
- **Styling**: Tailwind CSS - Utility-first CSS framework for responsive design
- **UI Components**: Custom component library with accessibility-first implementation
- **Package Manager**: pnpm - Fast, disk space-efficient package management

## Key Features

- **Responsive Design** - Fully responsive interface optimized for all devices
- **Advanced UI Components** - Rich collection of pre-built, accessible components
- **Dark Mode Support** - Theme provider with seamless light/dark mode switching
- **Toast Notifications** - User-friendly notification system for feedback
- **Form Management** - Comprehensive form handling with validation
- **Data Visualization** - Chart components for effective data presentation
- **Accessibility** - WCAG-compliant components ensuring inclusive design

## Project Structure

```
├── app/                    # Next.js application directory
├── components/            # Reusable React components
│   ├── ui/               # Shadcn UI component library
│   └── theme-provider.tsx # Theme configuration
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── public/              # Static assets
├── styles/              # Global stylesheets
└── Configuration files  # TypeScript, PostCSS, Next.js config
```

## Installation

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher (or npm/yarn)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BehaviourLab
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your web browser

## Development

### Available Commands

- `pnpm dev` - Start development server with hot module reloading
- `pnpm build` - Create optimized production build
- `pnpm start` - Start production server
- `pnpm lint` - Run code quality checks

### File Organization

- **Pages**: Located in `app/` directory following Next.js App Router conventions
- **Components**: Reusable components in `components/ui/` for consistency
- **Styles**: Global styles in `styles/globals.css` with Tailwind integration
- **Utilities**: Helper functions in `lib/utils.ts`

## Code Quality

This project maintains high standards for code quality through:

- TypeScript strict mode for type safety
- ESLint configuration for code consistency
- Component-based architecture for maintainability
- Consistent naming conventions and file organization

## Deployment

The application is optimized for deployment on modern hosting platforms:

- **Build Output**: Next.js static export and server-side rendering capabilities
- **Environment Variables**: Configure via `.env.local` file
- **Performance**: Automatic code splitting, image optimization, and caching

## Contributing

Contributions are welcome. Please ensure all changes:

- Maintain TypeScript type safety
- Follow established code style guidelines
- Include appropriate component documentation
- Preserve accessibility standards

## License

This project is provided as-is for use within the BehaviourLab initiative.

## Support & Documentation

For detailed information about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learning Guide](https://nextjs.org/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
