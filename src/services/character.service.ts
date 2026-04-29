import CharacterRepository from '../repositories/character.repository';
import { ICharacter } from '../models/character.model';
import { Types } from 'mongoose';
import ArtifactRepository from '../repositories/artifact.repository';

type CharacterCreateInput = {
    name: string;
    description: string;
    species: string;
    isSleeping?: boolean;
    bestFriend?: string;
};

type CharacterPatchInput = Partial<CharacterCreateInput>;

class CharacterService {
    async getAllCharacters(): Promise<ICharacter[]> {

        return await CharacterRepository.findAll();
    }

    async getCharacterById(id: string): Promise<ICharacter | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('INVALID_ID');
        }
        return await CharacterRepository.findById(id);
    }

    async createCharacter(input: CharacterCreateInput): Promise<ICharacter> {
        let bestFriendId: Types.ObjectId | undefined;

        if (typeof input.bestFriend === 'string') {
            if (!Types.ObjectId.isValid(input.bestFriend)) {
                throw new Error('INVALID_BEST_FRIEND_ID');
            }
            const bestFriend = await CharacterRepository.findById(input.bestFriend);
            if (!bestFriend) throw new Error('BEST_FRIEND_NOT_FOUND');
            bestFriendId = new Types.ObjectId(input.bestFriend);
        }

        return await CharacterRepository.create({
            name: input.name,
            description: input.description,
            species: input.species,
            isSleeping: input.isSleeping ?? false,
            bestFriend: bestFriendId
        });
    }

    async updateCharacter(id: string, patch: CharacterPatchInput): Promise<ICharacter | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('INVALID_ID');
        }

        const updatePatch: Partial<Pick<ICharacter, 'name' | 'description' | 'species' | 'isSleeping'>> = {};

        if (typeof patch.name === 'string') updatePatch.name = patch.name;
        if (typeof patch.description === 'string') updatePatch.description = patch.description;
        if (typeof patch.species === 'string') updatePatch.species = patch.species;
        if (typeof patch.isSleeping === 'boolean') updatePatch.isSleeping = patch.isSleeping;

        if (Object.keys(updatePatch).length === 0) {
            throw new Error('EMPTY_PATCH');
        }

        return await CharacterRepository.update(id, updatePatch);
    }

    async setBestFriend(id: string, bestFriendId: string | null): Promise<ICharacter | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('INVALID_ID');
        }

        if (bestFriendId === null) {
            return await CharacterRepository.updateBestFriend(id, null);
        }

        if (!Types.ObjectId.isValid(bestFriendId)) {
            throw new Error('INVALID_BEST_FRIEND_ID');
        }
        if (bestFriendId === id) {
            throw new Error('BEST_FRIEND_SELF');
        }

        const bestFriend = await CharacterRepository.findById(bestFriendId);
        if (!bestFriend) {
            throw new Error('BEST_FRIEND_NOT_FOUND');
        }

        return await CharacterRepository.updateBestFriend(id, bestFriendId);
    }

    async updateSleepStatus(id: string, isSleeping: boolean): Promise<ICharacter | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('INVALID_ID');
        }
        return await CharacterRepository.updateSleepStatus(id, isSleeping);
    }

    async deleteCharacter(id: string): Promise<ICharacter | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('INVALID_ID');
        }
        await ArtifactRepository.deleteManyByOwnerId(id);
        return await CharacterRepository.delete(id);
    }
}

export default new CharacterService();