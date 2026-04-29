import { Request, Response } from 'express';
import CharacterService from '../services/character.service';

class CharacterController {
    async getAll(req: Request, res: Response) {
        try {
            const characters = await CharacterService.getAllCharacters();
            res.json(characters);
        } catch (error) {
            res.status(500).json({ message: "Błąd podczas pobierania mieszkańców Doliny" });
        }
    }

    async updateSleepStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { isSleeping } = req.body ?? {};

            if (typeof isSleeping !== 'boolean') {
                return res.status(400).json({ message: '`isSleeping` musi być booleanem' });
            }

            const updated = await CharacterService.updateSleepStatus(id, isSleeping);

            if (!updated) {
                return res.status(404).json({ message: 'Nie znaleziono postaci' });
            }

            return res.json(updated);
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_ID') {
                return res.status(400).json({ message: 'Nieprawidłowe id' });
            }
            return res.status(500).json({ message: 'Błąd podczas aktualizacji statusu snu' });
        }
    }
}

export default new CharacterController();