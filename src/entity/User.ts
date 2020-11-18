import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, getRepository, Unique, PrimaryColumn } from "typeorm";
import AuthToken from "./AuthToken";
import { generateToken } from '../lib/token';

@Entity()
export default class User {

    @PrimaryColumn()
    id!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    async generateUserToken() {
      const authToken = new AuthToken();
      authToken.fk_user_id = this.id;

      await getRepository(AuthToken)
        .createQueryBuilder()
        .delete()
        .where("fk_user_id = :id", { id: this.id })
        .execute();
      
      await getRepository(AuthToken).save(authToken);
  
      // refresh token is valid for 30days
      const refreshToken = await generateToken(
        {
          user_id: this.id,
          token_id: authToken.fk_user_id
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d'
        }
      );
  
      const accessToken = await generateToken(
        {
          user_id: this.id
        },
        {
          subject: 'access_token',
          expiresIn: '1h'
        }
      );
  
      return {
        refreshToken,
        accessToken
      };
    }

    async refreshUserToken(tokenId: string, refreshTokenExp: number, originalRefreshToken: string) {
      const now = new Date().getTime();
      const diff = refreshTokenExp * 1000 - now;
      console.log('refreshing..');
      let refreshToken = originalRefreshToken;
      // renew refresh token if remaining life is less than 15d
      if (diff < 1000 * 60 * 60 * 24 * 15) {
        console.log('refreshing refreshToken');
        refreshToken = await generateToken(
          {
            user_id: this.id,
            token_id: tokenId
          },
          {
            subject: 'refresh_token',
            expiresIn: '30d'
          }
        );
      }
      const accessToken = await generateToken(
        {
          user_id: this.id
        },
        {
          subject: 'access_token',
          expiresIn: '1h'
        }
      );
  
      return { refreshToken, accessToken };
    }
}