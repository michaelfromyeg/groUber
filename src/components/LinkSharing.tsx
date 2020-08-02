import React from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }),
);

export default function FormPropsTextFields(props: any) {
    const classes = useStyles();
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField
                id="standard-read-only-input"
                label="Read Only"
                defaultValue={props.link}
                InputProps={{
                    readOnly: true,
                }}
            />
        </form>
    );
}
