import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import Register from './components/Register/Register.jsx'
import Channel from './components/Channel/Channel.jsx'
import Login from './components/Login/Login.jsx'
import VideoPlayer from './components/VideoPlayer/VideoPlayer.jsx'

function App() {
    const [playingVideo, setPlayingVideo] = useState(null);
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path='/' element={<Navigate to="/register" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route element={<Layout playingVideo={playingVideo} setPlayingVideo={setPlayingVideo} />}>
                    <Route path='/channel' element={<Channel />} />
                    <Route path='/video/:videoId' element={<VideoPlayer />} />
                </Route>
            </>
        )
    )
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )
}

export default App;