import { createContext, useState, useEffect } from 'react'
import { GoogleAuthProvider, getAuth ,signInWithPopup, onAuthStateChanged} from './services/firebase';
import { Route, BrowserRouter, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType );

function App() {

  const [user, setUser] = useState<User>()

  useEffect(()=>{
    const auth = getAuth()

    onAuthStateChanged(auth, user => {
      if(user){
        const { displayName, photoURL, uid } = user

        if(!displayName || !photoURL ) {
          throw new Error('Missing information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
  }, [])

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth()

    const result = await signInWithPopup(auth, provider)

    if(result.user) {
      const { displayName, photoURL, uid } = result.user

      if(!displayName || !photoURL ) {
        throw new Error('Missing information from Google Account.')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }


  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        <Routes>
            <Route path="/" element={<Home></Home>}/>
            <Route path="/rooms/new" element={<NewRoom></NewRoom>}/>
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
