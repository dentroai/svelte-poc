# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Running with Docker

This project includes a `Dockerfile` for building and running the application in a container.

**Prerequisites:**

*   Docker installed on your system.
*   An Anthropic API key (see `.env.example`).

**1. Build the Image:**

Navigate to the project root directory and run the build command. You need to pass the `ANTHROPIC_API_KEY` as a build argument. You can use a placeholder value here, as the real key will be provided at runtime.

```bash
docker build \
  --build-arg ANTHROPIC_API_KEY_ARG="build-time-dummy-key" \
  -t svelte-poc-app .
```

(Replace `svelte-poc-app` with your desired image name).

**2. Run the Container:**

Run the container, providing the *real* `ANTHROPIC_API_KEY` as a runtime environment variable using the `-e` flag. Map the container's port (default 3000) to a host port using the `-p` flag.

```bash
docker run -d \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY="YOUR_REAL_ANTHROPIC_API_KEY" \
  --name my-svelte-poc-container \
  svelte-poc-app
```

*   Replace `YOUR_REAL_ANTHROPIC_API_KEY` with your actual key.
*   Replace `3000:3000` if you want to map to a different host port (e.g., `8080:3000`).
*   The `-d` flag runs the container in detached mode (in the background).

Your application should now be accessible at `http://localhost:3000` (or your specified host port).
