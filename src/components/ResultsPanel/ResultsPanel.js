import React from 'react';
import pT from 'prop-types';
import { Panel, PanelHeading, Grid } from 'react-bootstrap';

function ResultsPanel({ children, heading }) {
  return (
    <Grid>
      <Panel bsStyle="info">
        <PanelHeading>
          {heading}
        </PanelHeading>
        {/* <PanelTitle>{'Test Title'}</PanelTitle> */}
        {/* <PanelBody>{'Test Body'}</PanelBody> */}
        {children}
      </Panel>
    </Grid>
  );
}

ResultsPanel.propTypes = {
  children: pT.node.isRequired,
  heading: pT.node.isRequired,
};

export default ResultsPanel;
