import { db } from "./firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    getDocs
} from "firebase/firestore";

export type ColumnType = "Dock" | "In Progress" | "Finished" | "Parked";

export interface Task {
    id: string;
    content: string;
    column: ColumnType;
    createdAt: any;
}

export interface Board {
    id: string;
    name: string;
    createdAt: any;
}

// --- BOARDS ---

export const createBoard = async (name: string) => {
    try {
        const docRef = await addDoc(collection(db, "boards"), {
            name,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error creating board: ", e);
        throw e;
    }
};

export const subscribeToBoards = (
    callback: (boards: Board[]) => void,
    onError?: (error: any) => void
) => {
    const q = query(collection(db, "boards"), orderBy("createdAt", "desc"));
    return onSnapshot(
        q,
        (snapshot) => {
            const boards = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Board));
            callback(boards);
        },
        (error) => {
            console.error("Error subscribing to boards:", error);
            if (onError) onError(error);
        }
    );
}

// --- TASKS ---

export const subscribeToTasks = (
    boardId: string,
    callback: (tasks: Task[]) => void,
    onError?: (error: any) => void
) => {
    const q = query(collection(db, `boards/${boardId}/tasks`), orderBy("createdAt", "desc"));
    return onSnapshot(
        q,
        (snapshot) => {
            const tasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Task));
            callback(tasks);
        },
        (error) => {
            console.error("Error subscribing to tasks:", error);
            if (onError) onError(error);
        }
    );
}

export const addTask = async (boardId: string, content: string, column: ColumnType) => {
    await addDoc(collection(db, `boards/${boardId}/tasks`), {
        content,
        column,
        createdAt: serverTimestamp() // Use server timestamp (will need conversion on read if handling dates strictly)
    });
}

export const moveTask = async (boardId: string, taskId: string, newColumn: ColumnType) => {
    const taskRef = doc(db, `boards/${boardId}/tasks`, taskId);
    await updateDoc(taskRef, {
        column: newColumn
    });
}

export const deleteTask = async (boardId: string, taskId: string) => {
    await deleteDoc(doc(db, `boards/${boardId}/tasks`, taskId));
}
