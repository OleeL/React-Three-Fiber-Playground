// styles/global.js
import css from 'styled-jsx/css'
import create from 'zustand';

export interface IColorScheme {
    primary:         string,
    primaryInverted: string,
    secondary:       string,
    backgroundColor: string,
    color:           string
}

const Light: IColorScheme = {
    primary:         "#00b0e0",
    primaryInverted: "#ffffff",
    secondary:       "#38545c",
    backgroundColor: "#d1e0eb",
    color:           "#000000"  //black
}

const Dark: IColorScheme = {
    primary:         "#00485c",
    primaryInverted: "#DDDDDD",
    secondary:       "#303030",
    backgroundColor: "#373a3e",
    color:           "#ffffff"  //white
}

type TColorStore = {
    Selected: IColorScheme
}

export const useColorStore = create<TColorStore>(set => ({
    Selected: Dark,
}));

const GlobalStyles = css.global`

    @font-face {
        font-family: 'RobotoMono';
        src: url('/fonts/RobotoMono.ttf') format('truetype');
    }

    @font-face {
        font-family: 'RobotoMono';
        src: url('/fonts/RobotoMono-Italic.ttf') format('truetype')
        font-style: italic;
    }

    html {
        overflow-y: auto;
        background-color: ${Dark.backgroundColor};
        min-width: 0px;
        
        font-family: 'RobotoMono';
        font-style: normal;
    }

    body {
        margin: 0;
        width: 100%;
        height: 100%;
    }
`


export default GlobalStyles;