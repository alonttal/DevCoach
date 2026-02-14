import fs from 'fs/promises';
import path from 'path';

export class JsonFileAdapter<T> {
  private filePath: string;

  constructor(dataDir: string, fileName: string) {
    this.filePath = path.join(dataDir, fileName);
  }

  async read(): Promise<T | null> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async write(data: T): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });

    // Atomic write: temp file in same directory to avoid cross-device rename
    const tmpFile = path.join(
      dir,
      `.${path.basename(this.filePath)}.${Date.now()}.tmp`,
    );
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmpFile, this.filePath);
  }
}
