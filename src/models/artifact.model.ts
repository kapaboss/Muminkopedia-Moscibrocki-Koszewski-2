import { Schema, model, Document, Types } from 'mongoose';


export interface IArtifact extends Document {
    name: string;
    properties: string;
    owner: Types.ObjectId;
}

const nonBlankString = (value: unknown) =>
    typeof value === 'string' && value.trim().length > 0;

const artifactSchema = new Schema<IArtifact>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: { validator: nonBlankString, message: 'Nazwa artefaktu nie może być pusta' }
    },
    properties: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: { validator: nonBlankString, message: 'Właściwości artefaktu nie mogą być puste' }
    },
    owner: { type: Schema.Types.ObjectId, ref: 'Character', required: true }
}, {
    timestamps: true
});

export const Artifact = model<IArtifact>('Artifact', artifactSchema);