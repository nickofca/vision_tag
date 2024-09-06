import { loginUser } from "@components/api";
import React, {useState} from "react";


export default function LoginComponent () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    return (
        <>
            <h1>Log In</h1>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={loginUser(username, password)}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000',
                    color: '#fff',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer'
                }}
            />
        </>
    )
}