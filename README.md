# Fight The Mind

A mental health support platform connecting people with therapists and a community of shared experiences.

## Features

- **User Authentication** - Sign up, login, and manage your account
- **Find Therapists** - Search for licensed therapists in your area
- **Community Stories** - Share and read personal mental health journeys
- **Therapist Registration** - Mental health professionals can join the network

## Getting Started

### Prerequisites

- Node.js 18+ and npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Running the Application

You need to run both the **backend server** and the **frontend** for full functionality.

#### 1. Start the Backend Server

```sh
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the server (runs on http://localhost:3001)
npm run dev
```

The seed script creates:
- A demo user: `demo@example.com` / `password123`
- Sample therapists
- Sample community stories

#### 2. Start the Frontend

In a new terminal:

```sh
# From the project root
npm install

# Start the development server (runs on http://localhost:5173)
npm run dev
```

### API Endpoints

The backend provides the following endpoints:

**Authentication**
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Login to existing account
- `GET /api/auth/me` - Get current user

**Therapists**
- `GET /api/therapists` - Search therapists (query params: location, specialty, available)
- `GET /api/therapists/:id` - Get therapist details
- `POST /api/therapists` - Register as a therapist

**Stories**
- `GET /api/stories` - Get all stories (query params: category, search)
- `GET /api/stories/:id` - Get story with comments
- `POST /api/stories` - Create a new story
- `POST /api/stories/:id/like` - Like/unlike a story (requires auth)
- `POST /api/stories/:id/comments` - Add a comment

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
