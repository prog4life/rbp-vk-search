import React from 'react';
import {Panel, Grid} from 'react-bootstrap';

function ResultsPanel({children, header}) {
  return (
    <Grid>
      <Panel header={header} bsStyle="info">
        {children}
      </Panel>
    </Grid>
  );
}

export default ResultsPanel;
