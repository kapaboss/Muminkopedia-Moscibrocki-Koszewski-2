import { Schema, model, Document, Types } from 'mongoose';


export interface ICharacter extends Document {
    name: string;
    description: string;
    species: string;
    isSleeping: boolean;
    bestFriend?: Types.ObjectId | ICharacter;
}

const nonBlankString = (value: unknown) =>
    typeof value === 'string' && value.trim().length > 0;

const characterSchema = new Schema<ICharacter>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        validate: { validator: nonBlankString, message: 'Imię nie może być puste' }
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: { validator: nonBlankString, message: 'Opis nie może być pusty' }
    },
    species: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: { validator: nonBlankString, message: 'Gatunek nie może być pusty' }
    },
    isSleeping: { type: Boolean, default: false },
    bestFriend: { type: Schema.Types.ObjectId, ref: 'Character' }
}, {
    timestamps: true
});


export const Character = model<ICharacter>('Character', characterSchema);