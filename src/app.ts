import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import routes from './routes';
import logger from 'koa-logger';
import { consumeUser } from './lib/token';

const app = new Koa();
app.use(logger());
app.use(bodyParser());
app.use(consumeUser);
app.use(routes.routes()).use(routes.allowedMethods());

export default app;