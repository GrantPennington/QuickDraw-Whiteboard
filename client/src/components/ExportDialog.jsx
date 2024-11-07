import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, MenuItem, Select, Typography } from '@mui/material';
import { useDrawingCanvas } from '../context/CanvasContext';

export const ExportDialog = () => {
    const { exportCanvasAsImage } = useDrawingCanvas();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const file_types = [
        { value: 'jpeg', label: 'jpeg' },
        { value: 'png', label: 'png' },
    ];

    return (
        <React.Fragment>
        <Button onClick={handleClickOpen} variant="contained">
            Export
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: { width: 400 },
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const fileName = formJson.fileName;
                    const fileType = formJson.fileType;
                    //console.log(fileName, ' : ', fileType);
                    exportCanvasAsImage(fileName, fileType);
                    handleClose();
                },
            }}
        >
            <DialogTitle>Export Drawing</DialogTitle>
            <Divider />
            <DialogContent>
            {/* <DialogContentText>
                Export your drawing.
            </DialogContentText> */}
            <Typography>Select File Type:</Typography>
            <Select
                autoFocus
                required
                margin="dense"
                id="fileType"
                name="fileType"
                label="File Type"
                fullWidth
                variant="standard"
                defaultValue={'png'}
                sx={{ mb: 2 }}
            >
                {file_types.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                        {label.toUpperCase()}
                    </MenuItem>
                ))}
            </Select>
            <Typography>Enter File Name:</Typography>
            <TextField
                autoFocus
                required
                margin="dense"
                id="fileName"
                name="fileName"
                label="File Name"
                type="text"
                fullWidth
                variant="standard"
                sx={{ mb: 2 }}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Export</Button>
            </DialogActions>
        </Dialog>
        </React.Fragment>
    );
}

export default ExportDialog
