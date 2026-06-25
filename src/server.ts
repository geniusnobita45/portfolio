import dotenv from 'dotenv';
import { app, logger } from './index';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});
