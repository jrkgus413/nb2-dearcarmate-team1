import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      companyId: string;
      isAdmin: boolean;
    }

    interface Request {
      user?: User;
      csv?: any[];
    }
  }
}
