import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // ✅ ajoute useSelector
import { register } from '../../JS/Actions/user';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [newUser, setNewUser] = useState({ nom: "", email: "", telephone: "", motDePasse: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { msg } = useSelector((s) => s.userReducer); // ✅ lit le msg du reducer

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(register(newUser));
      if (result.success) {
        setSuccess("Compte créé avec succès !");
        setTimeout(() => navigate('/accueil'), 1500);
        // ✅ reste sur Register si erreur, pas de navigate('/login')
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
          <h2>Rejoignez-nous !</h2>
          <p>Créez votre compte et découvrez des milliers de destinations de rêve avec Miha Travel.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-sub">Rejoignez la communauté Miha Travel</p>

          {/* ✅ affiche le msg d'erreur du reducer */}
          {msg && !success && (
            <div className="auth-alert error">
              {msg === "Email already exists" ? "Cet email est déjà utilisé." : msg}
            </div>
          )}
          {success && (
            <div className="auth-alert success">{success}</div>
          )}

          <form onSubmit={handleUser} className="auth-form">
            <div className="auth-field">
              <label>Nom complet *</label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={newUser.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={newUser.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label>Téléphone</label>
              <input
                type="tel"
                name="telephone"
                placeholder="+216 XX XXX XXX"
                value={newUser.telephone}
                onChange={handleChange}
              />
            </div>
            <div className="auth-field">
              <label>Mot de passe *</label>
              <input
                type="password"
                name="motDePasse"
                placeholder="••••••••"
                value={newUser.motDePasse}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Inscription..." : "Créer mon compte"}
            </button>
          </form>

          <p className="auth-switch">
            Déjà un compte ?{" "}
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;