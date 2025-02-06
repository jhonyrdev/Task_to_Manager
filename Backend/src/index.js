import app from './app.js'
import {createConnection} from './dataBase.js'
import { PORT } from './config.js';

createConnection();

app.listen(PORT, () => {
  console.log('Initialize Server on port', PORT);
});