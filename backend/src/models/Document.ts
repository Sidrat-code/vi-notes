import mongoose, { Document, Schema } from 'mongoose';

export interface IPasteEvent {
    pastedText: string;
    position: number;
    timestamp: Date;
}

export interface IDocument extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    pasteEvents: IPasteEvent[];
    pasteCount: number;
    wordCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Untitled Document',
        trim: true
    },
    content: {
        type: String,
        default: ''
    },
    pasteEvents: [{
        pastedText: { type: String },
        position: { type: Number },
        timestamp: { type: Date, default: Date.now }
    }],
    pasteCount: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDocument>('Document', documentSchema);