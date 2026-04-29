import { Types } from 'mongoose';
import { IArtifact } from '../models/artifact.model';
import ArtifactRepository from '../repositories/artifact.repository';
import CharacterRepository from '../repositories/character.repository';

type ArtifactCreateInput = {
    name: string;
    properties: string;
    owner: string;
};

type ArtifactPatchInput = Partial<Pick<ArtifactCreateInput, 'name' | 'properties'>>;

class ArtifactService {
    async getAllArtifacts(): Promise<IArtifact[]> {
        return await ArtifactRepository.findAll();
    }

    async getArtifactById(id: string): Promise<IArtifact | null> {
        if (!Types.ObjectId.isValid(id)) throw new Error('INVALID_ID');
        return await ArtifactRepository.findById(id);
    }

    async createArtifact(input: ArtifactCreateInput): Promise<IArtifact> {
        if (!Types.ObjectId.isValid(input.owner)) throw new Error('INVALID_OWNER_ID');

        const ownerExists = await CharacterRepository.findById(input.owner);
        if (!ownerExists) throw new Error('OWNER_NOT_FOUND');

        return await ArtifactRepository.create({
            name: input.name,
            properties: input.properties,
            owner: new Types.ObjectId(input.owner)
        });
    }

    async patchArtifact(id: string, patch: ArtifactPatchInput): Promise<IArtifact | null> {
        if (!Types.ObjectId.isValid(id)) throw new Error('INVALID_ID');

        const updatePatch: Record<string, unknown> = {};
        if (typeof patch.name === 'string') updatePatch.name = patch.name;
        if (typeof patch.properties === 'string') updatePatch.properties = patch.properties;

        if (Object.keys(updatePatch).length === 0) throw new Error('EMPTY_PATCH');

        return await ArtifactRepository.update(
            id,
            updatePatch as Partial<Pick<IArtifact, 'name' | 'properties'>>
        );
    }

    async transferOwner(id: string, ownerId: string): Promise<IArtifact | null> {
        if (!Types.ObjectId.isValid(id)) throw new Error('INVALID_ID');
        if (!Types.ObjectId.isValid(ownerId)) throw new Error('INVALID_OWNER_ID');

        const ownerExists = await CharacterRepository.findById(ownerId);
        if (!ownerExists) throw new Error('OWNER_NOT_FOUND');

        return await ArtifactRepository.updateOwner(id, ownerId);
    }

    async deleteArtifact(id: string): Promise<IArtifact | null> {
        if (!Types.ObjectId.isValid(id)) throw new Error('INVALID_ID');
        return await ArtifactRepository.delete(id);
    }
}

export default new ArtifactService();
