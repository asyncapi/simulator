import React from 'react';
import './App.css';
import { PractText, Marker } from './components';
/*
NektariosFifes TODO: Idea: Add svg animations for loading.
 */
import Anim from '../src/svg anim.svg';
import { FillBar } from './components/index';

const App = () => {
    return (
        <>


            <Marker sketch>Test highlight</Marker>
            <br/>

            <Marker ribbon>Test highlight</Marker>



            <FillBar value={10}></FillBar>
            <br/>

            <FillBar  value={40}></FillBar>
            <br/>

            <FillBar  value={80}></FillBar>
            <br/>

            <PractText typographyPreset={'formal'}>Formal Typography</PractText>
            <PractText typographyPreset={'title2'}>Formal Typography</PractText>
            <PractText typographyPreset={'normal'}>Formal Typography</PractText>


        </>
    );
};

export default App;
