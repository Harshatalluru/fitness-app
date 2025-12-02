import { body } from 'express-validator';

export const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('fitnessGoal').notEmpty().withMessage('Fitness goal is required')
];

export const gymValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['commercial', 'home', 'apartment']).withMessage('Type must be commercial, home, or apartment'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer')
];

export const membershipValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('gymId').notEmpty().withMessage('Gym ID is required')
];