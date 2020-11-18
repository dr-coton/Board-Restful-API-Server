import {
    ConnectionManager,
    getConnectionManager,
    Connection,
    ConnectionOptions,
    createConnection
} from 'typeorm';
import entities from './entity';
import 'mysql';

export default class Database {
    connectionManager: ConnectionManager;

    constructor() {
        this.connectionManager = getConnectionManager();
    }

    async connect() {
        const connectionOptions: ConnectionOptions = {
            entities,
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            password: "root",
            database: "board",
            synchronize: true
        }

        return createConnection(connectionOptions);
    }

    async getConnection(): Promise<Connection> {
        const CONNECTION_NAME = `default`;
        if (this.connectionManager.has(CONNECTION_NAME)) {
          const connection = this.connectionManager.get(CONNECTION_NAME);
          try {
            if (connection.isConnected) {
              await connection.close();
            }
          } catch {}
          return connection.connect();
        }
    
        return this.connect();
      }
}