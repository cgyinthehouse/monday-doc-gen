# monday-doc-gen

## Prerequisites

Ensure you have **pnpm** installed. See [here](https://pnpm.io/installation).

Create a `.env` file in `ui/` and set your `PORT` and `VITE_MONDAY_API_KEY` (Get your token [here](https://bes1688.monday.com/apps/manage/tokens)).

## Run the project

### If you want to use the built version of the app
1. Run `pnpm i -r && pnpm run -r build && pnpm run -r start`. This will build the frontend and backend app then start the production build.

### If you want to use in development mode
1. Run `pnpm i -r && pnpm run -r dev`.


### TODO:
- [x] Downloading button for tomorrow and today if these days has contractor show up.
- [ ] Implement a periodic cleanup mechanism for obsolete output files.
- [ ] Develop a toggle switch to select between DOCX or PDF formats.
- [ ] Consolidate all DOCX files into a single PDF or ZIP archive.
- [ ] Create Dockerfile and docker-compose.yml for containerization.
