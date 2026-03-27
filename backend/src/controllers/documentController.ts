import { Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../middleware/auth';

export const saveDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, pasteEvents, wordCount } = req.body;
        const userId = req.user._id;

        let document = await Document.findOne({ user: userId, title });

        if (document) {
            document.content = content;
            document.pasteEvents = pasteEvents || document.pasteEvents;
            document.pasteCount = (pasteEvents || []).length;
            document.wordCount = wordCount || 0;
            document.updatedAt = new Date();
            await document.save();
        } else {
            document = await Document.create({
                user: userId,
                title,
                content,
                pasteEvents: pasteEvents || [],
                pasteCount: (pasteEvents || []).length,
                wordCount: wordCount || 0
            });
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving document' });
    }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
    try {
        const documents = await Document.find({ user: req.user._id })
            .sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching documents' });
    }
};

export const getDocument = async (req: AuthRequest, res: Response) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        res.status(200).json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching document' });
    }
};