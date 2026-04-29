import { Router } from 'express';
import CharacterController from '../controllers/character.controller';

const router = Router();


router.get('/', CharacterController.getAll);
router.get('/:id', CharacterController.getById);
router.post('/', CharacterController.create);
router.patch('/:id', CharacterController.patch);
router.patch('/:id/sleep', CharacterController.updateSleepStatus);
router.patch('/:id/best-friend', CharacterController.setBestFriend);
router.delete('/:id', CharacterController.delete);

export default router;