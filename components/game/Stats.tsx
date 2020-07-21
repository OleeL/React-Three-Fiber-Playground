import React, { FC } from 'react';
import css from 'styled-jsx/css';
import { useStore } from '../../stores/Store';

export interface IEntry {
    name: string, 
    value: string
}

const StatStyle = css`
    div {
        position: fixed;
        margin: 0;
        padding: 0px 15px 0px 15px;
        color: white;

        top: 5px;
        left: 5px;

        width: auto;
        height: auto;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }
    
    span {
        font-size: 16px;
        padding: 2px;
        border-radius: 4px;
        background-color: rgb(0,0,0,0.5);
    }
`

const Stats: FC = () => {
    const {stats} = useStore();
    return (
        <>
            <style jsx >{StatStyle} </style>
            <div>

                {stats.map((e, i) =>
                    <p key={i}>{e.name}: <span>{e.value}</span></p>
                )}
            </div>
        </>
    );
};

export default Stats;