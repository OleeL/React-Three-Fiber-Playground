import React, { FC } from 'react';
import styled from 'styled-components';
import { useStore } from '../../stores/StoreContext';
import { useObserver } from 'mobx-react-lite';

export interface IEntry {
    name: string, 
    value: string
}

const StatStyle = styled.div`
    position: fixed;
    margin: 0;
    padding: 0px 5px 0px 5px;
    color: white;

    top: 5px;
    left: 5px;

    width: 20%;
    height: 20%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
`

const Data = styled.span`
    font-size: 16px;
    padding: 2px;
    border-radius: 4px;
    background-color: rgb(0,0,0,0.5);

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