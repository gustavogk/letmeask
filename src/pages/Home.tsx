import { useNavigate } from 'react-router-dom';
import { ref, onValue, getDatabase } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';


import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { DataSnapshot } from 'firebase/database';


export function Home(){

    const navigate = useNavigate();
    const {signInWithGoogle, user} = useAuth();
    const [roomCode, setRoomCode] = useState('');


    async function handleCreateRoom() {

        if(!user){
            await signInWithGoogle() 
        }

        navigate('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent ){
        event.preventDefault();

        if(roomCode.trim()===''){
            return
        }

        const db = getDatabase();
        const roomRef = await ref(db,`rooms/${roomCode}`);
        
        onValue(roomRef, (snapshot: DataSnapshot) => {
            if(snapshot.exists()){
                if(snapshot.val().endedAt){
                    alert('Room already closed.')
                    return;
                }
                navigate(`/rooms/${roomCode}`)
            } else {
                alert('Room does not exists.')
            }
        });

        

        return
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
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator"> ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o codigo da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}