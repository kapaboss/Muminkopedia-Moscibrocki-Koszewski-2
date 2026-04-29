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

    async getById(req: Request, res: Response) {
        try {
            const character = await CharacterService.getCharacterById(req.params.id);
            if (!character) return res.status(404).json({ message: 'Nie znaleziono postaci' });
            return res.json(character);
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_ID') {
                return res.status(400).json({ message: 'Nieprawidłowe id' });
            }
            return res.status(500).json({ message: 'Błąd podczas pobierania postaci' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, description, species, isSleeping, bestFriend } = req.body ?? {};

            if (typeof name !== 'string' || typeof description !== 'string' || typeof species !== 'string') {
                return res.status(400).json({ message: 'Wymagane pola: name (string), description (string), species (string)' });
            }
            if (typeof isSleeping !== 'undefined' && typeof isSleeping !== 'boolean') {
                return res.status(400).json({ message: '`isSleeping` musi być booleanem' });
            }
            if (typeof bestFriend !== 'undefined' && typeof bestFriend !== 'string') {
                return res.status(400).json({ message: '`bestFriend` musi być stringiem (id) lub pominięte' });
            }

            const created = await CharacterService.createCharacter({ name, description, species, isSleeping, bestFriend });
            return res.status(201).json(created);
        } catch (error) {
            const err = error as any;
            if (err?.code === 11000) {
                return res.status(409).json({ message: 'Postać o takiej nazwie już istnieje' });
            }
            if (error instanceof Error) {
                if (error.message === 'INVALID_BEST_FRIEND_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe bestFriend id' });
                }
                if (error.message === 'BEST_FRIEND_NOT_FOUND') {
                    return res.status(404).json({ message: 'Nie znaleziono bestFriend' });
                }
            }
            return res.status(500).json({ message: 'Błąd podczas tworzenia postaci' });
        }
    }

    async patch(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, species, isSleeping } = req.body ?? {};

            const updated = await CharacterService.updateCharacter(id, { name, description, species, isSleeping });
            if (!updated) return res.status(404).json({ message: 'Nie znaleziono postaci' });
            return res.json(updated);
        } catch (error) {
            const err = error as any;
            if (err?.code === 11000) {
                return res.status(409).json({ message: 'Postać o takiej nazwie już istnieje' });
            }
            if (error instanceof Error) {
                if (error.message === 'INVALID_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe id' });
                }
                if (error.message === 'EMPTY_PATCH') {
                    return res.status(400).json({ message: 'Brak pól do aktualizacji' });
                }
            }
            return res.status(500).json({ message: 'Błąd podczas aktualizacji postaci' });
        }
    }

    async setBestFriend(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { bestFriend } = req.body ?? {};

            if (!(typeof bestFriend === 'string' || bestFriend === null)) {
                return res.status(400).json({ message: '`bestFriend` musi być stringiem (id) albo null' });
            }

            const updated = await CharacterService.setBestFriend(id, bestFriend);
            if (!updated) return res.status(404).json({ message: 'Nie znaleziono postaci' });
            return res.json(updated);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'INVALID_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe id' });
                }
                if (error.message === 'INVALID_BEST_FRIEND_ID') {
                    return res.status(400).json({ message: 'Nieprawidłowe bestFriend id' });
                }
                if (error.message === 'BEST_FRIEND_NOT_FOUND') {
                    return res.status(404).json({ message: 'Nie znaleziono bestFriend' });
                }
                if (error.message === 'BEST_FRIEND_SELF') {
                    return res.status(400).json({ message: 'bestFriend nie może wskazywać na siebie' });
                }
            }
            return res.status(500).json({ message: 'Błąd podczas aktualizacji relacji bestFriend' });
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

    async delete(req: Request, res: Response) {
        try {
            const deleted = await CharacterService.deleteCharacter(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Nie znaleziono postaci' });
            return res.json(deleted);
        } catch (error) {
            if (error instanceof Error && error.message === 'INVALID_ID') {
                return res.status(400).json({ message: 'Nieprawidłowe id' });
            }
            return res.status(500).json({ message: 'Błąd podczas usuwania postaci' });
        }
    }
}

export default new CharacterController();