import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from "./modules/HomePage";
import Loader from "./components/Loader";

import './App.css';

const GamePage = lazy(() => import("./modules/GamePage"));
const PageNotFound = lazy(() => import("./modules/404"));

function App() {
  const [gameId, setGameId] = useState('');

  return (
    <Routes>
      <Route
        index
        element={(
          <HomePage gameId={gameId} setGameId={setGameId} />
        )}
      />
      <Route
        path="/game/:id"
        element={(
          <Suspense fallback={<Loader delay={500} />}>
            <GamePage />
          </Suspense>
        )}
      />
      <Route
        path="*"
        element={(
          <Suspense fallback={<Loader delay={500} />}>
            <PageNotFound />
          </Suspense>
        )}
      />
    </Routes>
  );
}

export default App;
