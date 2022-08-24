import React, {useEffect, useRef, useState} from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color'
import ColorChooserWrapper from './ColorChooser.style';
import ClickAwayListener from './ClickAwayListener';
import notification from '@iso/components/Notification';

const ColorChooser = ({ colors, value, presetColors, onSelect, onAdd }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [colorPicker, setColorPicker] = useState({
    visible: false,
    color: selectedColor
  });
  const [renderColors, setRenderColors] = useState([]);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    setSelectedColor(value);
  }, [value]);

  useEffect(() => {
    setRenderColors(colors);
  }, [colors]);

  const handleColorSelect = (index) => {
    const color = renderColors[index];
    setSelectedColor(color);
    onSelect(color);
  };

  const addNewColor = () => {
    setColorPicker({
      ...colorPicker,
      visible: false
    });

    if (!colorPickerRef.current) return;

    if (presetColors.includes(colorPickerRef.current.color)) {
      notification('error', 'Color already used');
      return;
    }

    if (renderColors.includes(colorPickerRef.current.color)) {
      notification('error', 'Color already added');
      return;
    }

    setRenderColors([...renderColors, colorPickerRef.current.color]);
    if (onAdd) onAdd([...renderColors, colorPickerRef.current.color]);
  };

  const handleColorPickerChange = (color) => {
    setColorPicker({
      ...colorPicker,
      color: color.hex
    });

    colorPickerRef.current = {color: color.hex}
  };

  const onAddNewClick = () => {
    setColorPicker({
      ...colorPicker,
      visible: true
    });

    colorPickerRef.current = null
  };

  return (
    <ColorChooserWrapper className="isoColorOptions">
      {renderColors.map((color, index) => {
        return (
          <Button
            key={index}
            className={color === selectedColor ? 'selected' : ''}
            style={{background: color}}
            onClick={() => handleColorSelect(index)}
          />
        );
      })}
      <div style={{position: 'relative'}}>
        <Button key="new" className="actionBtn" onClick={onAddNewClick}><PlusOutlined /></Button>
        {colorPicker.visible &&
          <ClickAwayListener
            style={{position: 'absolute', zIndex: 2}}
            onClickAway={() => addNewColor()}
          >
            <SketchPicker color={colorPicker.color} onChange={handleColorPickerChange}/>
          </ClickAwayListener>
        }
      </div>
    </ColorChooserWrapper>
  );
}

ColorChooser.defaultProps = {
  colors: [],
  value: '',
  presetColors: [],
};

export default ColorChooser;
