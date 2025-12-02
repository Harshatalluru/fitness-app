import { Router } from 'express';
import { MembershipController } from '../controllers/MembershipController';
import { membershipValidation } from './validation';

/**
 * @swagger
 * /api/memberships:
 *   post:
 *     summary: Add user to gym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               gymId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User added to gym successfully
 *       400:
 *         description: Bad request
 *   delete:
 *     summary: Remove user from gym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               gymId:
 *                 type: string
 *     responses:
 *       204:
 *         description: User removed from gym successfully
 *       400:
 *         description: Bad request
 * /api/memberships/gym/{gymId}:
 *   get:
 *     summary: Get all members of a gym
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of gym members
 *       404:
 *         description: Gym not found
 * /api/memberships/user/{userId}:
 *   get:
 *     summary: Get all gyms for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's gyms
 *       404:
 *         description: User not found
 */

export function createMembershipRoutes(membershipController: MembershipController): Router {
  const router = Router();

  router.post('/', membershipValidation, membershipController.addUserToGym.bind(membershipController));
  router.delete('/', membershipValidation, membershipController.removeUserFromGym.bind(membershipController));
  router.get('/gym/:gymId', membershipController.getGymMembers.bind(membershipController));
  router.get('/user/:userId', membershipController.getUserGyms.bind(membershipController));

  return router;
}