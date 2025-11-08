import { Request, Response} from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const indexPage = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
}