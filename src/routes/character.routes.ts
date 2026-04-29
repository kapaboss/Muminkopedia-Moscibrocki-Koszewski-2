import { Router } from 'express';
import CharacterController from '../controllers/character.controller';

const router = Router();


router.get('/', CharacterController.getAll);
router.patch('/:id/sleep', CharacterController.updateSleepStatus);

export default router;