import Home from './components/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Room from './components/Room/Room'

import { UserProvider } from './context/UserContext'
import GroupGame from './components/GroupPlay/groupGame'
import GroupPlayPage from './components/GroupPlay/GroupPlay'
function App() {


  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Room />} />
            <Route path="/home" element={<Home />}/>
            <Route path="/group" element={<GroupPlayPage />} 
            />
            <Route path="/groupGame" element={<GroupGame />}/>
          </Routes>
        </Router>
      </UserProvider>
    </>
  )
}

export default App
