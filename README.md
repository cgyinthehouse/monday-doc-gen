# monday-doc-gen

## Prerequisites

Ensure you have **pnpm** installed. See [here](https://pnpm.io/installation).

Create a `.env` file in `ui/` and set your `PORT` and `VITE_MONDAY_API_KEY` (Get your token [here](https://bes1688.monday.com/apps/manage/tokens)).

## Run the project

### If you want to use production mode
1. Run `pnpm i -r && pnpm run -r build` to build the frontend and backend app.
2. Run `cd docgen && pnpm start` to start the backend server.
3. Open `ui/build/index.html` to start the app.

### If you want to use develop mode
1. If you want to use develop mode, run `pnpm i -r && pnpm run -r server`.
