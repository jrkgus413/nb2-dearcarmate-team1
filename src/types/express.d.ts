import 'express';

declare module 'express' {
  export interface Request {
    csv?: any[];
  }
}
