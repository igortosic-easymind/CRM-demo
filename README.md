# Easymindstudio CRM Demo

A modern CRM system built with Next.js 15, featuring client management, task tracking, and calendar scheduling.

## Features

- 👥 Client Management
- ✅ Task Tracking
- 📅 Calendar Integration
- 🔐 User Authentication
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Documentation

Project documentation is available in the [/docs](/docs) directory:

### Architecture

- [State Management](/docs/architecture/state-management.md)
- [Types System](/docs/architecture/types.md)
- [API Integration](/docs/architecture/api-integration.md)
- [Component Structure](/docs/architecture/component-structure.md)

### Development Guides

- [Development Setup](/docs/guides/development-setup.md)
- [Coding Standards](/docs/guides/coding-standards.md)
- [Deployment Guide](/docs/guides/deployment.md)

### Features

- [Authentication](/docs/features/authentication.md)
- [Client Management](/docs/features/client-management.md)
- [Calendar](/docs/features/calendar.md)

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Redux Toolkit
- **Authentication:** JWT
- **Database:** PostgreSQL
- **UI Components:** React, Radix UI
- **Charts:** Recharts
- **Icons:** Lucide Icons

## Demo

Try out CRM: [Live Demo](https://crm-demo-easymind.vercel.app)

Demo credentials:
- Username: `testuser`
- Password: `demo1234`

### Note
The backend project is hosted on a free instance web service on Render. As a result, it may be idle sometimes, causing the initial load to be slow. However, once the application is loaded, it should work normally.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/igortosic-easymind/CRM-demo.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Create a `.env` file in the root directory:
```env
API_URL="https://crm-demo-aufh.onrender.com/api"
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
project-root/
├── src/
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── store/          # Redux store setup
│   ├── types/          # TypeScript types
│   └── lib/            # Utility functions
├── docs/               # Documentation
├── public/             # Static files
└── tests/             # Test files
```

## Development

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font for optimal display.

### Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Deployment

The project is deployed on Vercel. For deployment instructions, check out:

- [Deployment Guide](/docs/guides/deployment.md)
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## Contributing

Please read our [Contributing Guide](/docs/guides/contributing.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Last Updated: January 29, 2025
