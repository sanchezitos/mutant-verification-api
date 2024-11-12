import mongoose, { Schema, Document } from 'mongoose';

interface DNADocument extends Document {
    dna: string[];
    isMut: boolean;
}

const DNASchema: Schema = new Schema({
    dna: { type: [String], required: true, unique: true },
    isMut: { type: Boolean, required: true }
});

const DNAModel = mongoose.model<DNADocument>('DNA', DNASchema);

export default DNAModel;
