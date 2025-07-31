
import { createContext,useContext,useState } from "react";
import {v4 as uuidv4} from "uuid";

const UserContext = createContext();


export const useUser = ()=>{
    return useContext(UserContext);
}

export const UserProvider = ({children})=>{
    const [username, setUsername] = useState("");
    const [userAvatar, setUserAvatar] = useState("monkey.jpg");
    const [groupId, setGroupId] = useState("");
    const [gameMode,setGameMode] = useState(null);

    const createGroup = ()=>{
        const id = uuidv4().split("-")[0]
        setGroupId(id)
        navigator.clipboard.writeText(id)
    }
    return (
        <UserContext.Provider
        value={{
          username,
          setUsername,
          userAvatar,
          setUserAvatar,
          groupId,
          setGroupId,
          createGroup,
          gameMode,
          setGameMode
        }}
      >
        {children}
      </UserContext.Provider>
    )
}