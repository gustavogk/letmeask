import { useState, useEffect } from "react";
import { ref, onValue ,getDatabase } from '../services/firebase';


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered:  boolean;
    isHighlighted: boolean;
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

}

export function useRoom( roomId?: string){

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
                }
            });
            setTittle(databaseRoom.title);
            setQuestions(parsedQuestions);

        }, {
            onlyOnce: false
        });
        
    },[roomId])

    return {
        questions, title
    }
}