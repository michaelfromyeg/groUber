import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Button, Toolbar, IconButton, Typography, makeStyles, Grid } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import * as firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));

const Header = ({ setSidebarOpen }: { setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const history = useHistory();
    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar>
                <Grid justify="space-between" alignItems="center" container>
                    <Grid item>
                        {setSidebarOpen && (
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="menu"
                                onClick={() => {
                                    setSidebarOpen(true);
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={() => {
                                history.push('/');
                            }}
                        >
                            <HomeIcon />
                        </IconButton>
                    </Grid>

                    <Grid item>
                        <Typography variant="h6">groUber</Typography>
                    </Grid>

                    <Grid item>
                        <Button
                            disableElevation
                            color="inherit"
                            onClick={() => {
                                firebase.auth().signOut();
                            }}
                        >
                            Logout
                        </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
