import { off } from "firebase/database";
import { useState, useEffect } from "react";
import { ref, onValue ,getDatabase} from '../services/firebase';
import { useAuth } from "./useAuth";


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered:  boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered:  boolean;
    isHighlighted: boolean;
    likeCount: number;
    hasLiked: boolean;

}

export function useRoom( roomId?: string){

    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTittle] = useState('');

    useEffect(()=>{
        
        const db = getDatabase();
        const roomRef = ref(db, `rooms/${roomId}`);

        onValue(roomRef, (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}; 
            
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
                }
            });
            setTittle(databaseRoom.title);
            setQuestions(parsedQuestions);

        }, {
            onlyOnce: false
        });

        return() => {
            off(roomRef,'value');
        }
        
    },[roomId, user?.id])

    return {
        questions, title
    }
}