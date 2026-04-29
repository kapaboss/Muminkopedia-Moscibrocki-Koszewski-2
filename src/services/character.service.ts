import CharacterRepository from '../repositories/character.repository';
import { ICharacter } from '../models/character.model';
import { Types } from 'mongoose';

class CharacterService {
    async getAllCharacters(): Promise<ICharacter[]> {

        return await CharacterRepository.findAll();
    }

    async getCharacterById(id: string): Promise<ICharacter | null> {
        return await CharacterRepository.findById(id);
    }

    async updateSleepStatus(id: string, isSleeping: boolean): Promise<ICharacter | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('INVALID_ID');
        }
        return await CharacterRepository.updateSleepStatus(id, isSleeping);
    }
}

export default new CharacterService();