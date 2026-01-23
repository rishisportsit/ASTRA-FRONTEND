import { db } from "./firebase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    doc,
    deleteDoc
} from "firebase/firestore";

export interface ChatMessage {
    id?: string;
    text: string;
    sender: string;
    createdAt: Timestamp | null;
    type?: 'text' | 'system';
}

const COLLECTION_NAME = "messages";

export const sendMessage = async (text: string, sender: string) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            text,
            sender,
            createdAt: serverTimestamp(),
            type: 'text'
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const subscribeToMessages = (callback: (messages: ChatMessage[]) => void) => {
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "asc") // Oldest first
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ChatMessage));
        callback(messages);
    });
};
