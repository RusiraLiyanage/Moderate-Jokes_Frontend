import React, { Component, useState } from "react";
//import {Link, useNavigate} from 'react-router-dom';
import './adminAuth.css';
import JokesModerate from './JokesModerate.js';
import Swal from 'sweetalert2'
export default function Login() {
    //const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function SubmitHandler(e) {
    e.preventDefault();
    console.log(email, password);
    fetch("http://localhost:8050/login-admin", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Admin Authentication");
        if (data.status == "ok") {
          Swal.fire("Login Successful");
          //alert("login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          //navigate('./jokesModerate');
          window.location.href = './jokesModerate';
        }else{
            Swal.fire(data.error);
            //alert(data.error);
            window.location.reload(true);
        }
      });
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={SubmitHandler}>
          <h3>Admin Authentication</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <br/>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br/>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Authenticate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
