import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Avatar, Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { CreateNewFolder } from "@mui/icons-material";
import FileSelector from "./UI/FileSelector";
import { DigiwfLib } from "@miragon-process-ide/digiwf-lib";

interface Props {
    vs: any;
    currentPath: string;
}

const GenerateProjectInput: React.FC<Props> = props => {
    const [name, setName] = useState<string>("");
    const [path, setPath] = useState<string>(props.currentPath);

    const digiwfLib = useMemo(() => {
        return new DigiwfLib()
    }, []);

    const generate = useCallback(() => {
        if (name !== '' && path !== '') {
            digiwfLib.initProject(name)
                .then(artifacts => {
                    // todo move this into a custom hook
                    props.vs.postMessage({
                        command: 'generateProject',
                        data: {
                            name: name,
                            artifacts: artifacts,
                            path: path
                        }
                    });
                })
                .catch(err => console.error(err));
        }
    }, [name, path, props.vs, digiwfLib]);

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
                            props.vs.setState({...props.vs.getState(), name: e.target.value});
                        }}
                        autoFocus
                        error={name === ''}
                    />
                    <FileSelector
                        vs={props.vs}
                        path={props.currentPath}
                        onPathChange={ (p:string) => setPath(p)}
                    />
                    <Button
                        onClick={generate}
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3, mb: 2 }}
                    >Projekt generieren</Button>
                </Box>
            </FormControl>
    );
}

export default GenerateProjectInput;
