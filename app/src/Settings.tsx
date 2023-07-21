import React, { useContext, useState, useEffect } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ForwardIcon from '@mui/icons-material/Forward';
import { context } from './state';
import { primary_dark } from './constant';

export function Settings() {
  const { state, actions } = useContext(context);
  const navigate = useNavigate();

  const [topAge, setTopAge] = useState(state.settings.topAge);
  const [baseAge, setBaseAge] = useState(state.settings.baseAge);
  const [verticalScale, setVerticalScale] = useState(state.settings.verticalScale);

  state.settings.topAge = topAge;
  state.settings.baseAge = baseAge;

  const handleButtonClick = () => {
    actions.setTab(1);
    actions.setAllTabs(true);
  
    // Validate the user input
    if (isNaN(topAge) || isNaN(baseAge) || isNaN(verticalScale)) {
      // Handle invalid input, show error message, etc.
      return;
    }

    console.log("new values: baseage=> ", baseAge);
    console.log("new values: baseage.settings=> ", state.settings.baseAge);
    actions.updateSettingsXML(); // Call the updateSettingsXML directly
  
    actions.generateChart();
  
    navigate('/chart');
  };
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      border={1}
      borderRadius={4}
      borderColor="gray"
      maxWidth="400px"
      margin="0 auto"
      marginTop="50px"
    >
      <TextField
        label="Top Age (Ma)"
        type="number"
        value={topAge}
        onChange={(event) => setTopAge(parseFloat(event.target.value))}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <TextField
        label="Base Age (Ma)"
        type="number"
        value={baseAge}
        onChange={(event) => setBaseAge(parseFloat(event.target.value))}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <TextField
        label="Vertical Scale (cm/Ma)"
        type="number"
        value={verticalScale}
        onChange={(event) => setVerticalScale(parseFloat(event.target.value))}
        style={{ marginBottom: '20px', width: '100%' }}
      />
      <Button
        sx={{ backgroundColor: primary_dark, color: '#FFFFFF' }}
        onClick={handleButtonClick}
        variant="contained"
        style={{ width: '100%', height: '75px' }}
        endIcon={<ForwardIcon />}
      >
        Make your own chart
      </Button>
    </Box>
  );
}
