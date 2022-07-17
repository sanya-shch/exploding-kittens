import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import HomePage from "./modules/HomePage";
import Loader from "./components/Loader";
import Header from "./components/Header";

import './App.css';

const GamePage = lazy(() => import("./modules/GamePage"));
const PageNotFound = lazy(() => import("./modules/404"));

const Layout = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
    </>
  );
};

function App() {
  const [gameId, setGameId] = useState('');

  return (
    <Routes>
      <Route index element={<HomePage gameId={gameId} setGameId={setGameId} />} />
      <Route element={<Layout />}>
        {/*<Route path="/join" element={(*/}
        {/*  <Suspense fallback={<Loader delay={500} />}>*/}
        {/*    <JoinPage />*/}
        {/*  </Suspense>*/}
        {/*)} />*/}
        {/*<Route*/}
        {/*  path="/settings"*/}
        {/*  element={(*/}
        {/*    <Suspense fallback={<Loader delay={500} />}>*/}
        {/*      <SettingsPage gameId={gameId} setGameId={setGameId} />*/}
        {/*    </Suspense>*/}
        {/*  )}*/}
        {/*/>*/}
        <Route path="/game/:id" element={(
          <Suspense fallback={<Loader delay={500} />}>
            <GamePage />
          </Suspense>
        )} />
        {/*<Route path="/error" element={(*/}
        {/*  <Suspense fallback={<Loader delay={500} />}>*/}
        {/*    <ErrorPage />*/}
        {/*  </Suspense>*/}
        {/*)} />*/}
        <Route path="*" element={(
          <Suspense fallback={<Loader delay={500} />}>
            <PageNotFound />
          </Suspense>
        )} />
      </Route>
    </Routes>
  );
}

export default App;
