# Token Trading Table

A high-performance, real-time token trading interface built with Next.js and Node.js.

## Features

- **Real-time Updates**: Live price updates via WebSocket.
- **Responsive Design**: Built with Tailwind CSS and Shadcn/UI.
- **Sorting & Filtering**: Client-side sorting and filtering for seamless UX.
- **Animations**: Smooth transitions and price flash effects using Framer Motion.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion.
- **Backend**: Node.js, Express, `ws` (WebSocket).

## Setup

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1.  **Clone the repository** (if applicable)
2.  **Install dependencies**:

    ```bash
    # Frontend
    cd frontend
    npm install

    # Backend
    cd ../backend
    npm install
    ```

### Running the Application

1.  **Start the Backend**:

    ```bash
    cd backend
    npm run build
    node dist/server.js
    ```

    The backend will run on `http://localhost:3001`.

2.  **Start the Frontend**:

    ```bash
    cd frontend
    npm run dev
    ```

    The frontend will run on `http://localhost:3000`.

## Design Decisions

- **Separate Backend**: A dedicated Node.js server was chosen to handle WebSockets efficiently, separating concerns from the Next.js frontend.
- **Client-side State**: `useTokenData` hook manages the merging of initial REST data and subsequent WebSocket updates for a responsive experience.
- **Animations**: Framer Motion provides performant animations for row entry and price updates, enhancing the "live" feel of the trading table.
