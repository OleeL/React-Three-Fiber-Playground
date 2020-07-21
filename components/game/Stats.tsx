import React, { FC } from 'react';
import { useObserver } from 'mobx-react-lite';
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
`

const Data = css`
    span {
        font-size: 16px;
        padding: 2px;
        border-radius: 4px;
        background-color: rgb(0,0,0,0.5);
    }

`

const Stats: FC = () => {
    const store = useStore();

    return useObserver(() => {
        const {stats} = store;
        return (
            <StatStyle> 
                {stats.map((e, i) =>
                    <p key={i}>{e.name}: <Data>{e.value}</Data></p>
                )}
            </StatStyle>
        );
    });
};

export default Stats;