# monday-doc-gen

## Prerequisites

1. Ensure you have **pnpm** installed. See [here](https://pnpm.io/installation).

2. Create a `.env` file in `ui/` and set your `VITE_MONDAY_API_KEY` (Get your token [here](https://bes1688.monday.com/apps/manage/tokens)) in it.

## Run the project

### Use the built version of the app

1. Run `pnpm i -r && pnpm run -r build && pnpm -r start`. This will build the frontend and backend app then start the production build.

### Use development mode

1. Run `pnpm i -r && pnpm run -r dev`.

### Use docker

1. Ensure the `VITE_NGROK_DOCGEN_URL` is set to the correct endpoint in the `ui/.env`, otherwise it will default to `https://monday-docgen.ngrok.io`.

1. Run `docker compose up -d`

### TODO:

- [x] Downloading button for tomorrow and today if these days has contractor show up.
- [x] Implement a periodic cleanup mechanism for obsolete output files.
- [ ] Develop a toggle switch to select between DOCX or PDF formats.
- [ ] Consolidate all DOCX files into a single PDF or ZIP archive.
- [x] Create Dockerfile and docker-compose.yml for containerization.
