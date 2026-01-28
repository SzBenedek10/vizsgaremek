import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Add hozzá az átirányításhoz
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { 
                email, 
                password_hash: password // Ezt kapja meg a backend
            });
            
            login(res.data.token, res.data.user); // Elmentjük a contextbe és localStorage-be
            alert("Üdvözlünk bent!");
            navigate('/'); // Átirányítás a főoldalra
        } catch (err) {
            alert(err.response?.data?.error || "Hiba történt");
        }
    };
    // ... a többi maradhat

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Jelszó" onChange={e => setPassword(e.target.value)} />
            <button type="submit">Belépés</button>
        </form>
    );
};