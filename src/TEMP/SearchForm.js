import { Checkbox } from 'react-bootstrap';

<Col xs={10} sm={6} lg={4}>
  {/* TODO: min-height: 74px;
            padding-top: 20px;   */}
  {/* <FormGroup> */}
  <Checkbox
    checked={useExecute}
    id="useExecute"
    onChange={this.handleInputValueChange}
    title="Use execute method to call API"
  >
    {'Use "execute" method'}
  </Checkbox>
  {/* </FormGroup> */}
</Col>