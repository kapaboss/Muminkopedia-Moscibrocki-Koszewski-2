import { Character, ICharacter } from '../models/character.model';

class CharacterRepository {

    async findAll(): Promise<ICharacter[]> {
        return await Character.find().populate('bestFriend');
    }


    async findById(id: string): Promise<ICharacter | null> {
        return await Character.findById(id).populate('bestFriend');
    }


    async create(characterData: Partial<ICharacter>): Promise<ICharacter> {
        const character = new Character(characterData);
        return await character.save();
    }

    async updateSleepStatus(id: string, isSleeping: boolean): Promise<ICharacter | null> {
        return await Character.findByIdAndUpdate(
            id,
            { $set: { isSleeping } },
            { new: true }
        ).populate('bestFriend');
    }

    async delete(id: string): Promise<ICharacter | null> {
        return await Character.findByIdAndDelete(id);
    }
}

export default new CharacterRepository();