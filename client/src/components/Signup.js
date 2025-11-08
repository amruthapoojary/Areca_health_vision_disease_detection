import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Signup.css';
import { useTranslation } from "react-i18next";
import LanguageSelector from './LanguageSelector';

function Signup() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { email, password };

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Sign-up successful");
            } else {
                const errorMessage = await response.text();
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error signing up');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center signup-container" style={{ height: '100vh' }}>
            <div className="signup-form p-4">
                
                <form onSubmit={handleSubmit}>
                    <h2 className="text-center mb-4 text-white">{t("Sign Up")}</h2>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="text-white">{t("Email")}</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="text-white">{t("Password")}</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-success w-100" type="submit">
                        {t("SIGN UP")}
                    </button>
                    <p className="text-center mt-3 text-white">
                        {t("Already have an account?")} <Link to="/login" className="text-white">{t("Login")}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;