import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Bar from './Bar'
import Line from './Line'
import Scatter from './Scatter'
import Pie from './Pie'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: '0 6px 12px rgba(0, 128, 0, 0.3)',
  p: 4,
  textAlign: 'center',
};

const EntryBox = ({ headers, open, onClose,onGenerate }) => {
  const chart_type = ['bar', 'line', 'pie', 'scatter'];
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [type, setType] = useState('');


const handleSubmit = () => {
  if (!xAxis || !yAxis || !type) {
    alert("Please select X axis, Y axis, and chart type");
    return;
  }

  if (onClose) onClose();

  onGenerate({
    xAxis,
    yAxis,
    type,
    aiSummary: null,
  });
};


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="axis-modal"
    >
      <Box sx={style}>
        <TextField
          select
          fullWidth
          label="X Axis"
          variant="outlined"
          value={xAxis}
          onChange={(e) => setXAxis(e.target.value)}
          sx={{ mb: 2 }}
        >
          {headers.map((header, i) => (
            <MenuItem key={i} value={header}>
              {header}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Y Axis"
          variant="outlined"
          value={yAxis}
          onChange={(e) => setYAxis(e.target.value)}
          sx={{ mb: 3 }}
        >
          {headers
            .filter((header) => header !== xAxis)
            .map((header, i) => (
              <MenuItem key={i} value={header}>
                {header}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Chart type"
          variant="outlined"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ mb: 3 }}
        >
          {chart_type.map((chtype, i) => (
            <MenuItem key={i} value={chtype}>
              {chtype}
            </MenuItem>
          ))}
        </TextField>

        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#16a34a',
            color: '#fff',
            px: 3,
            '&:hover': {
              backgroundColor: '#15803d',
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default EntryBox;
