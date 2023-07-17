import React, { useEffect } from 'react';
import { MemoryRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.global.css';
import { Editor } from './containers/Editor';
import { ipcRenderer, IpcRendererEvent } from 'electron';

function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

function Contact() {
  return <h2>Contact Page</h2>;
}

async function fetchUserData() {
  try {
    const userData = await ipcRenderer.invoke('fetch-user-data');
    console.log(userData);
  } catch (error) {
    console.error('Error:', error);
  }
}

export default function App() {

  useEffect(() => {
    ipcRenderer.send('set-title')
    fetchUserData();
  }, [])

  function handleClick() {
    ipcRenderer.send('button-click');
  }
  

  return (
    <>
    <Router>
      {/* <Switch>
        <Route path="/" component={Editor} />
      </Switch> */}
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <hr />
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </div>
    </Router>
    <input type="button" value="Select AsyncAPI file" id='btn-readfile' onClick={handleClick} />
    </>
  );
}
