
import {Link, useNavigate} from 'react-router-dom'
import { FormEvent, useState } from 'react';
import { ref, set, getDatabase, push } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';

import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth';


export function NewRoom(){
    const navigate = useNavigate();
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim() === ''){
            return;
        }

        const db = getDatabase();
        const roomRef = await ref(db,'rooms');
        const firebaseRoom = await push(roomRef);

        set(firebaseRoom, {
            title: newRoom,
            authorId: user?.id,
        })

        navigate(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustracao simbolizando perguntas e respostas" />
                <strong> Crie salas de Q&amp;A ao-vivo </strong>
                <p>Tire as duvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask"/>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to='/'>clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}