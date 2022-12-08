import React, {useCallback, useState} from "react";
import CSS from 'csstype';
import {Button, TextField, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";

const pathSelector: CSS.Properties = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: 'normal'
};

interface Props {
    vs: any,
    path: string
    onPathChange: any
}

const FileSelector: React.FC<Props> = props => {
    const [path, setPath] = useState(props.path);

    const openFilePicker =  useCallback(() => {
        props.vs.postMessage({
            message:'openFilePicker',
        })
    }, [props.vs]);

    return (
        <div>
            <div style={pathSelector}>
                <TextField
                    required
                    id="path"
                    label="Path"
                    name="path"
                    value={path}
                    onChange={e => {
                        setPath(e.target.value);
                        props.onPathChange(e.target.value);
                    }}
                    error={path === ''}
                />
                <Button onClick={openFilePicker} variant="outlined" startIcon={<Add/>}>
                    Choose Path
                </Button>
            </div>
            {path === '' && <Typography variant="subtitle2" color="red">You have to insert a path!</Typography>}
        </div>
    );
}

export default FileSelector;
