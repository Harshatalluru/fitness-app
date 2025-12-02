import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateGym } from '../../usecases/gym/CreateGym';
import { GetGyms } from '../../usecases/gym/GetGyms';
import { DeleteGym } from '../../usecases/gym/DeleteGym';
import { UpdateGym } from '../../usecases/gym/UpdateGym';

export class GymController {
  constructor(
    private createGym: CreateGym,
    private getGyms: GetGyms,
    private deleteGym: DeleteGym,
    private updateGym: UpdateGym
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const gym = await this.createGym.execute(req.body);
      res.status(201).json(gym);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const gyms = await this.getGyms.execute();
      res.json(gyms);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const gym = await this.getGyms.executeById(req.params.id);
      res.json(gym);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async getWithAvailability(req: Request, res: Response): Promise<void> {
    try {
      const gyms = await this.getGyms.executeWithAvailability();
      res.json(gyms);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteGym.execute(req.params.id);
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

      const gym = await this.updateGym.execute(req.params.id, req.body);
      res.json(gym);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}