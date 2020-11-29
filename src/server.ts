import './env';
import app from './app';
import Database from './database';

const { PORT } = process.env;

const database = new Database();
database.getConnection();

app.listen(PORT, () => {
  console.log('Board API server is listening to port', PORT);
});
