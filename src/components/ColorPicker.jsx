import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'
import state from '../store'

const ColorPicker = ({ inline = false }) => {
  const snap = useSnapshot(state)

  const colorMap = {
    shirt: snap.shirtColor,
    pants: snap.pantsColor,
    shoes: snap.shoesColor,
  }

  const currentColor = snap.selectedMesh ? colorMap[snap.selectedMesh] : '#5B8CFF'

  const handleChange = (color) => {
    if (snap.selectedMesh === 'shirt') state.shirtColor = color.hex
    else if (snap.selectedMesh === 'pants') state.pantsColor = color.hex
    else if (snap.selectedMesh === 'shoes') state.shoesColor = color.hex
  }

  const picker = (
    <SketchPicker
      color={currentColor}
      disableAlpha
      onChange={handleChange}
    />
  )

  if (inline) {
    return <div className="color-picker-inline">{picker}</div>
  }

  return (
    <div className="absolute left-full ml-3">
      {picker}
    </div>
  )
}

export default ColorPicker
