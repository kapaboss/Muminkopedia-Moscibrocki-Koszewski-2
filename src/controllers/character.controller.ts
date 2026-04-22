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
}

export default new CharacterController();