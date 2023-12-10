import React from 'react'
import InputMask from 'react-input-mask'

function MaskedInput({value, onChange}) {
  return (
    <InputMask 
    mask={"999.999.999-99"}
    value={value}
    onChange={onChange}/>
  )
}

export default MaskedInput