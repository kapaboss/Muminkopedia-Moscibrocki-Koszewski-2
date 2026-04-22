import { Schema, model, Document, Types } from 'mongoose';


export interface ICharacter extends Document {
    name: string;
    description: string;
    species: string;
    isSleeping: boolean;
    bestFriend?: Types.ObjectId | ICharacter;
}


const characterSchema = new Schema<ICharacter>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    species: { type: String, required: true },
    isSleeping: { type: Boolean, default: false },
    bestFriend: { type: Schema.Types.ObjectId, ref: 'Character' }
}, {
    timestamps: true
});


export const Character = model<ICharacter>('Character', characterSchema);