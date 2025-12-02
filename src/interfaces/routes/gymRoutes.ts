import { Router } from 'express';
import { GymController } from '../controllers/GymController';
import { gymValidation } from './validation';

/**
 * @swagger
 * /api/gyms:
 *   post:
 *     summary: Create a new gym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Gym created successfully
 *   get:
 *     summary: Get all gyms
 *     responses:
 *       200:
 *         description: List of gyms
 * /api/gyms/{id}:
 *   get:
 *     summary: Get gym by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gym details
 *       404:
 *         description: Gym not found
 *   delete:
 *     summary: Delete gym by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Gym deleted successfully
 *       404:
 *         description: Gym not found
 *   put:
 *     summary: Update gym by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Gym updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Gym not found
 * /api/gyms/availability:
 *   get:
 *     summary: Get gyms sorted by available spots
 *     responses:
 *       200:
 *         description: List of gyms with availability
 */

export function createGymRoutes(gymController: GymController): Router {
  const router = Router();

  router.post('/', gymValidation, gymController.create.bind(gymController));
  router.get('/', gymController.getAll.bind(gymController));
  router.get('/availability', gymController.getWithAvailability.bind(gymController));
  router.get('/:id', gymController.getById.bind(gymController));
  router.put('/:id', gymValidation, gymController.update.bind(gymController));
  router.delete('/:id', gymController.delete.bind(gymController));

  return router;
}