import { Router } from 'express';
import ArtifactController from '../controllers/artifact.controller';

const router = Router();

router.get('/', ArtifactController.getAll);
router.get('/:id', ArtifactController.getById);
router.post('/', ArtifactController.create);
router.patch('/:id', ArtifactController.patch);
router.patch('/:id/owner', ArtifactController.transferOwner);
router.delete('/:id', ArtifactController.delete);

export default router;
