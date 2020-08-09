import React, { FC } from 'react';
import css from 'styled-jsx/css';

const OverlayStyle = css`
    div {
        position: fixed;
        padding: 0;
        margin: 0;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        pointer-events: none;
        box-shadow: inset 0px 0px 75px -1px rgba(0,0,0,0.75);
    }
`
const Overlay: FC = () =>
    <div>
        <style jsx >{OverlayStyle} </style>
    </div>

export default Overlay;