import Router from '@koa/router';
import { getRepository, In, Like } from 'typeorm';
import User from '../entity/User';
import { setTokenCookie } from '../lib/token';
import authorized from '../lib/middlewares/authorized';
import Article from '../entity/Aritcle';
const routes = new Router();

routes.get('/', ctx => {
    ctx.body = 'Hello World! \nCurrent Date : ' + Date();
});

// 회원가입 
routes.post('/signup', async ctx => {

    type RequestBody = {
        id: string;
        name: string;
        password: string;
    }

    const { id, name, password }: RequestBody = ctx.request.body;

    const exists = await getRepository(User)
        .createQueryBuilder()
        .where('id = :id', { id })
        .getOne();

    if (exists) {
        ctx.status = 200;
        ctx.body = {
            error_code : 1,
            message: "중복된 아이디입니다."
        };
        return;
    }

    const userRepo = getRepository(User);
    const user = new User();
    user.id = id;
    user.name = name;
    user.password = password;

    await userRepo.save(user);

    const tokens = await user.generateUserToken();
    setTokenCookie(ctx, tokens);
    ctx.body = {
        ...user,
        tokens: {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
        }
    };
});

// 로그인
routes.post('/signin', async ctx => {

    type RequestBody = {
        id: string;
        password: string;
    }

    const { id, password }: RequestBody = ctx.request.body;

    const user = await getRepository(User)
    .createQueryBuilder("user")
    .where('id = :id', { id })
    .getOne();

    if (!user || user === undefined) {
        ctx.status = 200;
        ctx.body = {
            error_code : 2,
            message: "올바른 아이디가 아닙니다."
        };
        return;
    }

    if (user?.password !== password) {
        ctx.status = 200;
        ctx.body = {
            error_code : 3,
            message: "올바른 패스워드가 아닙니다."
        };
        return;
    }

    const tokens = await user.generateUserToken();
    setTokenCookie(ctx, tokens);

    console.log(user);

    ctx.body = {
        tokens: {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
        }
    };
});

// 글 작성하기 
routes.post('/article/write', authorized, async ctx => {
    
    const id = ctx.state.user_id;

    const user = await getRepository(User)
    .createQueryBuilder("user")
    .where('id = :id', { id })
    .getOne();

    if (!user) {
        ctx.status = 200;
        ctx.body = {
            error_code : 4,
            message: "비정상적인 접근입니다."
        };
        return;
    }

    type RequestBody = {
        title: string;
        contents: string;
    }

    const { title, contents }: RequestBody = ctx.request.body;

    const articleRepo = getRepository(Article);
    const article = new Article();
    article.user = user;
    article.title = title;
    article.contents = contents;

    await articleRepo.save(article);

    ctx.body = {
        article_id : article.article_id,
        created_date : article.created_at
    };
});

// 글 전체 가져오기 
routes.get('/article/all', authorized, async ctx => {
    
    const id = ctx.state.user_id;

    const user = await getRepository(User)
    .createQueryBuilder("user")
    .where('id = :id', { id })
    .getOne();

    if (!user) {
        ctx.status = 200;
        ctx.body = {
            error_code : 4,
            message: "비정상적인 접근입니다."
        };
        return;
    }

    type RequestBody = {
        title: string;
        contents: string;
    }

    const article = await getRepository(Article).createQueryBuilder("article")
    .leftJoinAndSelect("article.user", "uid").getMany();

    // const article = await getRepository(Article).createQueryBuilder("article")
    // .leftJoinAndSelect("article.user", "uid").take(10).getMany();

    ctx.body = {
        ...article
    };
});

// 특정 글 가져오기 
routes.get('/article/:aid', authorized, async ctx => {
    
    const id = ctx.state.user_id;

    const user = await getRepository(User)
    .createQueryBuilder("user")
    .where('id = :id', { id })
    .getOne();

    if (!user) {
        ctx.status = 200;
        ctx.body = {
            error_code : 4,
            message: "비정상적인 접근입니다."
        };
        return;
    }

    const { aid } = ctx.params;

    const article = await getRepository(Article).createQueryBuilder("article").where("article_id = :aid", {aid}).leftJoinAndSelect("article.user", "uid").getOne();

    ctx.body = {
        ...article
    };
});

// 글 검색하기
routes.get('/article/search/:keyword', authorized, async ctx => {
    
    const id = ctx.state.user_id;

    const user = await getRepository(User)
    .createQueryBuilder("user")
    .where('id = :id', { id })
    .getOne();

    if (!user) {
        ctx.status = 200;
        ctx.body = {
            error_code : 4,
            message: "비정상적인 접근입니다."
        };
        return;
    }

    const { keyword } = ctx.params;

    const article = await getRepository(Article)
    .find({
        take: 10,
        where : {
            title: Like(`%${keyword}%`)
        }
    });

    ctx.body = {
        ...article
    };
});


export default routes;