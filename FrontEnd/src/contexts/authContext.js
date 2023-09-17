import axios from '../axiosInstance'
import { createContext,useState } from "react"

export const AuthContext=createContext()

export const AuthContextProvider=({children})=>{
   const [user, setUser] = useState(null)
   async function login (inputs,userType){
       let res= await axios.post(`/auth/login/${userType}`,inputs)
       if(res.data.err)return null
       else if(res.data.loginProblem){
        await logout();
       }
       setUser(res.data.user)
       return res.data.user
    }
    const logout=async()=>{
        await axios.post('/auth/logout')
        setUser(null)
    }   
    
    return <AuthContext.Provider value={{login,logout,user,setUser}}>{children}</AuthContext.Provider>
}