# The Dev Journal

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-vercel-black.svg)](https://the-dev-journal.vercel.app/)
[![Next.js](https://img.shields.io/badge/built%20with-Next.js%2015-blue.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/styled%20with-TailwindCSS%204-38bdf8.svg)](https://tailwindcss.com/)

A modern blogging platform for developers built with Next.js and DatoCMS.

## 🌐 Live Demo

Visit the live site: [https://the-dev-journal.vercel.app/](https://the-dev-journal.vercel.app/)

## 📝 Description

The Dev Journal is a blogging platform designed specifically for developers to share knowledge, tutorials, and insights about programming and technology. This platform leverages modern web technologies to provide a seamless and responsive user experience.

## ✨ Features

- Modern, responsive design with Tailwind CSS
- Server-side rendering with Next.js 15
- Content management through DatoCMS
- Rich text editing with syntax highlighting (Prism.js)
- UI components built with Radix UI
- Theme switching with dark/light modes
- Progressive Web App (PWA) support
- Email notifications via Brevo integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Lucide React for icons
- **Content Management**: DatoCMS with GraphQL
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: Vercel
- **Data Storage**: Vercel KV
- **Email**: Resend/Brevo

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tech-Vexy/The-Dev-Journal.git
   cd The-Dev-Journal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your API keys and configuration values.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Build

To build the project for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## 🔄 Deployment

This project is deployed on [Vercel](https://vercel.com/). Any push to the main branch will trigger an automatic deployment.

### Deployment Configuration

The deployment is set up with the following:

- Automatic HTTPS
- Global CDN
- Serverless functions
- Environment variables management
- Analytics and performance monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

- [Tech-Vexy](https://github.com/Tech-Vexy)

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [DatoCMS](https://www.datocms.com/)
- [Vercel](https://vercel.com/)
