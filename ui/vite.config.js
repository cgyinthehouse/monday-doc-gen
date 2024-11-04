import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve as _resolve } from "path";

export default defineConfig(() => {
	return {
		build: {
			outDir: "build",
		},
		resolve: {
			alias: {
				"@docgen": _resolve(__dirname, "../docgen/src"),
			},
		},
		plugins: [react()],
		server: {
			port: 8301,
		},
	};
});
