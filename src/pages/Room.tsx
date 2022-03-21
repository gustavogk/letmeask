import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import { ref, set, onValue ,getDatabase, push } from '../services/firebase';

import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered:  boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered:  boolean;
    isHighlighted: boolean;

}

type RoomParams = {
    id: string;
}

export function Room(){

    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTittle] = useState('');

    const roomId = params.id;

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

    async function handleSendQuestion(event: FormEvent) {

        event.preventDefault();

        if (newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,

            },
            isHighlighted: false,
            isAnswered: false
        };

        const db = getDatabase();

        const questionRef = await ref(db,`rooms/${roomId}/questions`);
        const firebaseQuestion = await push(questionRef);

        await set(firebaseQuestion, question);

        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={ roomId || ''}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que voce quer perguntar?"
                        onChange={ event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faca seu login</button>.</span>
                        )}
                        
                        <Button type='submit' disabled={!user} >Enviar pergunta</Button>
                    </div>
                </form>

                {JSON.stringify(questions)}
            </main>
        </div>
    );
}