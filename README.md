# Boom Bito

**Boom Bito** is a secure, ephemeral, realtime chat application designed for private conversations. It enables users to create temporary chat rooms that self-destruct after use or upon request. With anonymous identities and no persistent storage of messages beyond the room's lifespan, it ensures privacy and security.

## Features

- **Realtime Messaging**: Instant message delivery using Upstash Realtime (Pub/Sub).
- **Ephemeral Rooms**: Rooms and messages are stored in Redis with a TTL (Time To Live), ensuring they automatically expire.
- **Anonymous Identity**: Users are assigned generated usernames for anonymity.
- **Room Security**:
  - Randomly generated Room IDs.
  - Capacity limits (max 2 users per room) to ensure privacy.
  - "Room Not Found" and "access denied" handling.
- **Self-Destruct**: Ability to explicitly destroy a room, which wipes all data and notifies connected users.
- **Typewriter UI**: A retro-style, aesthetically pleasing user interface.

## How It Works (Architecture)

The application follows a modern full-stack architecture leveraging Next.js for the frontend and Elysia.js for the backend.

1.  **Lobby**: The user lands on the home page. A generic username is generated.
2.  **Room Creation**: The user clicks "Create Secure Room".
    - A request is sent to the backend (`POST /api/rooms/create`).
    - The server generates a random `roomId`, creates a Redis hash for metadata, and sets an expiration (TTL).
3.  **Joining a Room**: The user is redirected to `/room/[roomId]`.
    - **Middleware Logic** (`src/proxy.ts` logic): Checks if the room exists and if it's full (max 2 users) before allowing access. _Note: Ensure middleware is correctly configured in your deployment._
    - **Authentication**: A session token (cookie) is assigned to the user if they are allowed in.
4.  **Messaging**:
    - Users send messages via the API (`POST /api/messages`).
    - Messages are stored in a Redis list for the room's history.
    - Messages are broadcasted in real-time to all users in the room using Upstash Realtime.
5.  **Termination**:
    - When a user destroys the room, a `DELETE` request is sent.
    - The server publishes a "destroy" event to the socket, redirecting all users to the lobby.
    - All Redis keys associated with the room are deleted.

## Tech Stack

- **Framework**: **Next.js** (App Router, React 19)
- **Backend API**: **Elysia** (mounted as a Next.js API route)
- **Language**: **TypeScript**
- **Runtime**: **Bun**
- **Database (Cache/Store)**: **Upstash Redis**
- **Realtime / PubSub**: **Upstash Realtime**
- **Styling**: **Tailwind CSS**
- **Validation**: **Zod**

## Folder Structure

```
.
├── src
│   ├── app                 # Next.js App Router pages and API routes
│   │   ├── api             # Backend API routes
│   │   │   ├── [[...slugs]] # Elysia API entry point (catch-all)
│   │   │   └── realtime    # Realtime auth/webhook endpoints
│   │   ├── room/[roomId]   # Chat room page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Lobby (Home) page
│   ├── components          # React UI components (Lobby, RoomHeader, etc.)
│   ├── hooks               # Custom React hooks (useCreateRoom, useRoomMessages)
│   ├── lib                 # Shared utilities and singleton clients
│   │   ├── client.ts       # Eden (Elysia) API client
│   │   ├── realtime.ts     # Realtime configuration and schema
│   │   ├── redis.ts        # Redis client configuration
│   └── proxy.ts            # Middleware logic for room access control
├── public                  # Static assets
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd boom-bito
    ```

2.  **Install dependencies:**
    This project uses [Bun](https://bun.sh/).

    ```bash
    bun install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your Upstash credentials.

    ```bash
    cp .env.example .env
    ```

    Required keys:

    ```env
    UPSTASH_REDIS_REST_URL=your_redis_url
    UPSTASH_REDIS_REST_TOKEN=your_redis_token
    # If required by your realtime implementation setup:
    # UPSTASH_REALTIME_URL=...
    ```

4.  **Run Development Server:**
    ```bash
    bun dev
    ```
    The app will be available at `http://localhost:3000`.

## Development Workflow

- **Frontend**: Edit `src/app` and `src/components`.
- **Backend**: Edit `src/app/api/[[...slugs]]/route.ts` to modify Elysia routes.
- **Type Safety**: The project uses **Eden** to provide end-to-end type safety between the Elysia backend and the frontend client (`src/lib/client.ts`).

## Build & Deployment

To build the application for production:

```bash
bun run build
bun run start
```

This project handles both frontend and backend in a single Next.js build, making it easy to deploy on platforms like Vercel.

## Scripts

- `bun dev`: Starts the development server.
- `bun build`: Builds the application for production.
- `bun start`: Starts the production server.
- `bun lint`: Runs ESLint.

## Future Improvements

- **Global Middleware Integration**: Ensure `src/proxy.ts` logic is fully integrated as `middleware.ts` to strictly enforce room access at the edge.
- **User Authentication**: Add optional persistent user accounts.
- **Media Support**: Allow sending images or files in chat.
- **Encryption**: Implement end-to-end encryption for messages before they hit the server.
