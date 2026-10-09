import vinext from "vinext";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const isVercelDeployment = process.env.VERCEL === "1";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: [],
  r2_buckets: [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const deploymentPlugin =
    isVercelDeployment
      ? (await import("nitro/vite")).nitro({ preset: "vercel" })
      : (await import("@cloudflare/vite-plugin")).cloudflare({
          viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
          config: localBindingConfig,
        });

  return {
    // Prebundle the lazy renderer with the same React instance as the app.
    optimizeDeps: { include: ["@react-three/fiber", "three"] },
    environments: {
      ssr: {
        build: {
          rolldownOptions: {
            output: {
              // Keep icon factories together to avoid cycles between client boundaries.
              manualChunks(id: string) {
                if (id.includes("/lucide-react/")) return "lucide";
              },
            },
          },
        },
      },
    },
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      tailwindcss(),
      vinext(),
      sites(),
      deploymentPlugin,
    ],
  };
});
