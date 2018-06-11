import React from 'react';
import {
  Panel, PanelTitle, PanelHeading, PanelBody, Grid,
} from 'react-bootstrap';

import ResultsFilter from 'components/ResultsFilter';

function ResultsPanel({ children, header }) {
  return (
    <Grid>
      <Panel header={header} bsStyle="info">
        <PanelHeading>
          <ResultsFilter />
        </PanelHeading>
        {/* <PanelTitle>{'Test Title'}</PanelTitle> */}
        {/* <PanelBody>{'Test Body'}</PanelBody> */}
        {children}
      </Panel>
    </Grid>
  );
}

export default ResultsPanel;
