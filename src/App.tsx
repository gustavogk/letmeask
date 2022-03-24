import { Route, BrowserRouter, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";

import {AuthContextProvider} from './contexts/AuthContext'
import { AdminRoom } from "./pages/AdminRoom";




function App() {



  return (
    <BrowserRouter>
       <AuthContextProvider>
        <Routes>
            <Route path="/" element={<Home></Home>}/>
            <Route path="/rooms/new" element={<NewRoom></NewRoom>}/>
            <Route path="/rooms/:id" element={<Room></Room>}/>
            <Route path="/admin/rooms/:id" element={<AdminRoom></AdminRoom>}/>
        </Routes>
        </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
