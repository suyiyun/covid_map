import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function CountyCard(props) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          County: {props.countyName}
        </Typography>
 
        <Typography variant="body2">
          Confirmed: {props.confirmed}
        </Typography>
        <Typography variant="body2">
          Death: {props.deaths}
        </Typography>
        <Typography variant="body2">
          Recovered: {props.recovered}
        </Typography>

      </CardContent>

    </Card>
  );
}
