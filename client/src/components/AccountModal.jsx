import { useState } from "react";
import { X, UserRound, LockKeyhole, Mail } from "lucide-react";

export default function AccountModal({ open, onClose, onSubmit, busy, error }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (!open) return null;
  const submit = event => {
    event.preventDefault();
    onSubmit({ mode, name, email, password });
  };
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section className="account-modal" onMouseDown={event => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close"><X size={19}/></button>
      <div className="account-emblem"><UserRound size={22}/></div>
      <span className="overline">WELCOME TO SHOPSPHERE</span>
      <h2>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
      <p className="modal-subtitle">{mode === "signup" ? "Join us to save your cart and make shopping easier." : "Sign in to access your account and cart."}</p>
      <form onSubmit={submit} className="account-form">
        {mode === "signup" && <label><span>Full name</span><div><UserRound size={16}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" minLength="2" required/></div></label>}
        <label><span>Email address</span><div><Mail size={16}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></div></label>
        <label><span>Password</span><div><LockKeyhole size={16}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" minLength="8" required/></div></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-action" disabled={busy}>{busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}</button>
      </form>
      <p className="switch-auth">{mode === "signup" ? "Already have an account?" : "New to ShopSphere?"} <button onClick={()=>{setMode(mode==="signup"?"login":"signup");setPassword("");}}>{mode==="signup"?"Sign in":"Create an account"}</button></p>
      <p className="demo-note">Assessment demo: accounts are held in server memory and reset when the API restarts.</p>
    </section>
  </div>;
}
