import { createMuiTheme } from '@material-ui/core';
import { readProperty } from '../utils/sassHelper';

export default createMuiTheme({
    palette: {
        primary: { main: readProperty('dark-gray') },
        secondary: { main: readProperty('orange') },
        error: { main: readProperty('red') },
        warning: { main: readProperty('yellow') },
        info: { main: readProperty('blue') },
        success: { main: readProperty('green') },
    },
    typography: {
        fontFamily: [readProperty('primary-font')].join(','),
    },
});
