import React, { FC } from 'react';
import css from 'styled-jsx/css';
import { useStore, _store } from '../../stores/Store';

export interface IEntry {
    name: string,
    value: string
}

const StatisticsStyle = css`
    div {
        padding: 15px;
        color: white;
        line-height: 25px;
        width: auto;
        height: auto;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 0px 0px 5px 5px;
    }
    
    span {
        font-size: 16px;
        padding: 2px;
        border-radius: 4px;
        background-color: rgb(0,0,0,0.5);
    }

    p { 
        margin: 0;
    }
`

const ButtonStyle = css`
    div {
        border-radius: 5px 5px 0px 0px;
        background-color: rgba(0, 0, 0, 0.75);

        margin: 0;
        padding: 0px 15px 0px 15px;
        line-height: 33px;
        user-select: none; 
    }

    div:hover {
        background-color: rgba(50, 50, 50, 0.5);
    }
`

const PanelStyle = css`
    div {
        position: fixed;
        margin: 0;
        color: white;

        top: 5px;
        left: 5px;
    }
`

const ShowStatsButton = () => {
    const { toggleShowStats } = useStore();
    const onClick = () => {
        toggleShowStats();
    }

    return (
        <div onClick={onClick} >
            Toggle Statistics
            <style jsx>{ButtonStyle}</style>
        </div>
    )
}

const Statistics: FC = () => {
    const { stats } = useStore();
    
    return (
        <div>
            {stats.map((e, i) =>
                <p key={i}>{e.name}: <span>{e.value}</span></p>
            )}
            <style jsx >{StatisticsStyle} </style>
        </div>
    );
};

export const AddStatistics = () => {
    const addStats = _store.getState().addStats;
    const camera = _store.getState().camera;
    const player = _store.getState().player;
    const showStats = _store.getState().showStats;

    if (!showStats) return;
    addStats([
        { name: "rotation-x", value: camera.camera.rotation.x.toString() } as IEntry,
        { name: "rotation-y", value: camera.camera.rotation.y.toString() } as IEntry,
        { name: "player-pos-x", value: player?.group?.position.x.toString() } as IEntry,
        { name: "player-pos-y", value: player?.group?.position.y.toString() } as IEntry,
        { name: "player-pos-z", value: player?.group?.position.z.toString() } as IEntry
    ]);
}

const StatisticsPanel: FC = () => {
    const { showStats } = useStore();

    return (
        <div>
            <ShowStatsButton />
            {showStats && <Statistics />}
            <style jsx >{PanelStyle} </style>
        </div>
    );
}

export default StatisticsPanel;