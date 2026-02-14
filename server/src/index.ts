import { createApp } from './app';
import { config } from './config';
import { initRepositories } from './repositories';

async function main() {
  await initRepositories(config.dataDir);
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`DevCoach server running on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
