import dotenv from 'dotenv';
import path from 'path';

const { NODE_ENV } = process.env;


console.log(process.env.NODE_ENV)

dotenv.config({
  path: path.resolve(process.cwd(), NODE_ENV === 'development' ? '.env.development' : '.env')
});