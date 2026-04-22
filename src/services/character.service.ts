import CharacterRepository from '../repositories/character.repository';
import { ICharacter } from '../models/character.model';

class CharacterService {
    async getAllCharacters(): Promise<ICharacter[]> {

        return await CharacterRepository.findAll();
    }

    async getCharacterById(id: string): Promise<ICharacter | null> {
        return await CharacterRepository.findById(id);
    }
}

export default new CharacterService();