import { Request, Response } from 'express';
import { ManageMembership } from '../../usecases/membership/ManageMembership';

export class MembershipController {
  constructor(private manageMembership: ManageMembership) {}

  async addUserToGym(req: Request, res: Response): Promise<void> {
    try {
      const { userId, gymId } = req.body;
      const membership = await this.manageMembership.addUserToGym(userId, gymId);
      res.status(201).json(membership);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async removeUserFromGym(req: Request, res: Response): Promise<void> {
    try {
      const { userId, gymId } = req.body;
      await this.manageMembership.removeUserFromGym(userId, gymId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getGymMembers(req: Request, res: Response): Promise<void> {
    try {
      const members = await this.manageMembership.getGymMembers(req.params.gymId);
      res.json(members);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async getUserGyms(req: Request, res: Response): Promise<void> {
    try {
      const gyms = await this.manageMembership.getUserGyms(req.params.userId);
      res.json(gyms);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}