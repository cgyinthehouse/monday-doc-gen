# monday-doc-gen

Ensure you have **pnpm** installed. See [here](https://pnpm.io/installation)

### For local development
1. Create `.env` in `ui/` and set your `PORT` and `VITE_MONDAY_API_KEY` (Get it [here](https://bes1688.monday.com/apps/manage/tokens)).
1. Run `pnpm i -r && pnpm run -r server`.


### For production build
1. Run `pnpm i -r && pnpm run -r start`.