import 'express';
import Express from 'express';

declare module 'express' {
  export interface Request {
    csv?: any[];
  }
}

declare global {
    namespace Express {
        interface User {
            id: string;
        }

        interface Request {
            user?: User;
        }

    }
}