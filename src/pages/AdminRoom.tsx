
import { useNavigate, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import { remove, update } from 'firebase/database';
import { ref ,getDatabase} from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom(){

    const params = useParams<RoomParams>();
    const roomId = params.id;

    const navigate = useNavigate();

    const {title, questions} = useRoom(roomId)


    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que voce deseja excluir essa pargunta?')){
            
            const db = getDatabase();
            const questionRef = await ref(db, `rooms/${roomId}/questions/${questionId}`)

            await remove(questionRef)
        }
    }

    async function handleEndRoom(){
        const db = getDatabase();
        const questionRef = await ref(db, `rooms/${roomId}`)

        await update(questionRef, {
            endedAt: new Date()
        })

        navigate('/');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={ roomId || ''}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <div className='question-list'>
                    {questions.map( question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            > 
                                <button
                                    type="button"
                                    onClick={()=> handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
               
            </main>
        </div>
    );
}