import { Artifact, IArtifact } from '../models/artifact.model';

class ArtifactRepository {
    async findAll(): Promise<IArtifact[]> {
        return await Artifact.find().populate('owner', 'name species isSleeping');
    }

    async findById(id: string): Promise<IArtifact | null> {
        return await Artifact.findById(id).populate('owner', 'name species isSleeping');
    }

    async create(artifactData: Partial<IArtifact>): Promise<IArtifact> {
        const artifact = new Artifact(artifactData);
        const saved = await artifact.save();
        return await saved.populate('owner', 'name species isSleeping');
    }

    async update(
        id: string,
        patch: Partial<Pick<IArtifact, 'name' | 'properties'>>
    ): Promise<IArtifact | null> {
        return await Artifact.findByIdAndUpdate(
            id,
            { $set: patch },
            { new: true }
        ).populate('owner', 'name species isSleeping');
    }

    async updateOwner(id: string, ownerId: string): Promise<IArtifact | null> {
        return await Artifact.findByIdAndUpdate(
            id,
            { $set: { owner: ownerId } },
            { new: true }
        ).populate('owner', 'name species isSleeping');
    }

    async delete(id: string): Promise<IArtifact | null> {
        return await Artifact.findByIdAndDelete(id).populate('owner', 'name species isSleeping');
    }

    async deleteManyByOwnerId(ownerId: string): Promise<number> {
        const result = await Artifact.deleteMany({ owner: ownerId });
        return result.deletedCount ?? 0;
    }
}

export default new ArtifactRepository();
