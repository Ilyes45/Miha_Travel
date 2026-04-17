import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // ✅ ajoute useSelector
import { login } from '../../JS/Actions/user';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [user, setUser]       = useState({ email: "", motDePasse: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { msg } = useSelector((s) => s.userReducer); // ✅ lit le msg du reducer

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(login(user));
      if (result.success) {
        navigate('/accueil'); // ✅ navigue seulement si succès
      }
    } catch {
      // géré par le reducer
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <img src="/logo.png" alt="Miha Travel" className="auth-logo" />
          <h2>Bon retour !</h2>
          <p>Connectez-vous pour accéder à vos réservations et profiter de nos offres exclusives.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Se connecter</h1>
          <p className="auth-sub">Accédez à votre espace personnel</p>

          {/* ✅ affiche le msg d'erreur du reducer */}
          {msg && (
            <div className="auth-alert error">
              {msg === "Invalid credentials !!!" ? "Email ou mot de passe incorrect." : msg}
            </div>
          )}

          <form onSubmit={handleUser} className="auth-form">
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label>Mot de passe</label>
              <input
                type="password"
                name="motDePasse"
                placeholder="••••••••"
                value={user.motDePasse}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth-switch">
            Pas encore de compte ?{" "}
            <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;