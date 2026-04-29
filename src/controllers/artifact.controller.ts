import { Request, Response } from 'express';
import ArtifactService from '../services/artifact.service';

class ArtifactController {
    async getAll(req: Request, res: Response) {
        try {
            const artifacts = await ArtifactService.getAllArtifacts();
            return res.json(artifacts);
        } catch {
            return res.status(500).json({ message: 'Błąd podczas pobierania artefaktów' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const artifact = await ArtifactService.getArtifactById(req.params.id);
            if (!artifact) return res.status(404).json({ message: 'Nie znaleziono artefaktu' });
            return res.json(artifact);
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_ID') {
                return res.status(400).json({ message: 'Nieprawidłowe id' });
            }
            return res.status(500).json({ message: 'Błąd podczas pobierania artefaktu' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, properties, owner } = req.body ?? {};

            if (typeof name !== 'string' || typeof properties !== 'string' || typeof owner !== 'string') {
                return res.status(400).json({ message: 'Wymagane pola: name (string), properties (string), owner (string)' });
            }

            const created = await ArtifactService.createArtifact({ name, properties, owner });
            return res.status(201).json(created);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'INVALID_OWNER_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe owner id' });
                }
                if (error.message === 'OWNER_NOT_FOUND') {
                    return res.status(404).json({ message: 'Nie znaleziono właściciela' });
                }
            }
            return res.status(500).json({ message: 'Błąd podczas tworzenia artefaktu' });
        }
    }

    async patch(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, properties } = req.body ?? {};

            const updated = await ArtifactService.patchArtifact(id, { name, properties });
            if (!updated) return res.status(404).json({ message: 'Nie znaleziono artefaktu' });
            return res.json(updated);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'INVALID_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe id' });
                }
                if (error.message === 'EMPTY_PATCH') {
                    return res.status(400).json({ message: 'Brak pól do aktualizacji (name/properties)' });
                }
            }
            return res.status(500).json({ message: 'Błąd podczas aktualizacji artefaktu' });
        }
    }

    async transferOwner(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { owner } = req.body ?? {};

            if (typeof owner !== 'string') {
                return res.status(400).json({ message: 'Wymagane pole: owner (string)' });
            }

            const updated = await ArtifactService.transferOwner(id, owner);
            if (!updated) return res.status(404).json({ message: 'Nie znaleziono artefaktu' });
            return res.json(updated);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'INVALID_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe id' });
                }
                if (error.message === 'INVALID_OWNER_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe owner id' });
                }
                if (error.message === 'OWNER_NOT_FOUND') {
                    return res.status(404).json({ message: 'Nie znaleziono właściciela' });
                }
            }
            return res.status(500).json({ message: 'Błąd podczas transferu właściciela artefaktu' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deleted = await ArtifactService.deleteArtifact(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Nie znaleziono artefaktu' });
            return res.json(deleted);
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_ID') {
                return res.status(400).json({ message: 'Nieprawidłowe id' });
            }
            return res.status(500).json({ message: 'Błąd podczas usuwania artefaktu' });
        }
    }
}

export default new ArtifactController();
