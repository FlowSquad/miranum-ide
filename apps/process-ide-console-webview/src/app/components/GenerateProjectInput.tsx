import * as React from 'react';
import { useMemo, useState } from 'react';
import { Avatar, Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { CreateNewFolder } from "@mui/icons-material";
import FileSelector from "./UI/FileSelector";
import {DigiwfLib} from "@miragon-process-ide/digiwf-lib";
import {useInputChangeMessage, useProjectMessage} from "./Hooks/Message";

interface Props {
    vs: any;
    currentPath: string;
    name: string;
}

const GenerateProjectInput: React.FC<Props> = props => {
    const [name, setName] = useState<string>(props.name);
    const [path, setPath] = useState<string>(props.currentPath);
    const [pressed, setPressed] = useState<boolean>(false);

    const digiwfLib = useMemo(() => {
        return new DigiwfLib()
    }, []);

    const generate =  useProjectMessage(props.vs, digiwfLib, name, path);
    const inputChange = useInputChangeMessage(props.vs);

    return (
            <FormControl
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <CreateNewFolder />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Generate Project
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                            inputChange(e.target.value);
                        }}
                        autoFocus
                        error={name === ''}
                        helperText={(name === '' && pressed)? 'You have to insert a name!':' '}
                    />
                    <FileSelector
                        vs={props.vs}
                        path={path}
                        onPathChange={ (p:string) => setPath(p)}
                    />
                    <Button
                        onClick={() => {
                            setPressed(!name || !path);
                            generate();
                        }}
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3, mb: 2 }}
                    >generate Project</Button>
                </Box>
            </FormControl>
    );
}

export default GenerateProjectInput;
