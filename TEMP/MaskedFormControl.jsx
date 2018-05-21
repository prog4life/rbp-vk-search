import React from 'react';
import MaskedFormControl from 'react-bootstrap-maskedinput';


const MaskedFormControlComponent = () => (
  <MaskedFormControl
    disabled={disabled}
    mask="1111111111"
    formatCharacters={{
      // i: { validate(char) { return char === 'i'; } },
      // d: { validate(char) { return char === 'd'; } },
    }}
    placeholderChar=" "
    name="wallOwnerId" // TODO: here or for radio input ?
    onChange={onChange}
    placeholder="123456789"
    type="text"
    value={value}
  />

  <MaskedFormControl
    // componentClass={<MaskedInput />} // react-bootstrap prop
    disabled={disabled}
    mask={'w'.repeat(32)}
    formatCharacters={{
      w: {
        validate(char) { return /\w/.test(char); }, // \w === [A-Za-z0-9_]
        // transform(char) { return char.toUpperCase(); },
      },
    }}
    placeholderChar=" "
    name="wallOwnerShortName" // TODO: here or for radio input ?
    onChange={onChange}
    placeholder="short textual id of user or group"
    type="text"
    value={value}
  />
);

export default MaskedFormControlComponent;
