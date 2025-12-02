import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateUser } from '../../usecases/user/CreateUser';
import { GetUsers } from '../../usecases/user/GetUsers';
import { DeleteUser } from '../../usecases/user/DeleteUser';
import { UpdateUser } from '../../usecases/user/UpdateUser';

export class UserController {
  constructor(
    private createUser: CreateUser,
    private getUsers: GetUsers,
    private deleteUser: DeleteUser,
    private updateUser: UpdateUser
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = await this.createUser.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getUsers.execute();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getUsers.executeById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteUser.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = await this.updateUser.execute(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}