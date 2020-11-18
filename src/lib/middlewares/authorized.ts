import { Middleware } from 'koa';

const authorized: Middleware = (ctx, next) => {
  if (!ctx.state.user_id) {
    ctx.status = 401;
    ctx.body = {
      message: 'NOT_AUTHORIZED'
    };
    return;
  } 
  return next();
  
};

export default authorized;