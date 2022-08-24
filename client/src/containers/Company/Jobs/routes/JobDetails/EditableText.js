import React, {useEffect, useRef, useState} from 'react';
import Input from '@iso/components/uielements/input';
import useOnClickOutside from '@iso/lib/hooks/useOnClickOutside';

const EditableText = ({text, textWrapClassName, onComplete}) => {
  const [innerText, setInnerText] = useState('');
  const [editable, setEditable] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => {
    setEditable(false);
    onComplete(innerText);
  });

  useEffect(() => {
    setInnerText(text)
  }, [text]);

  const complete = () => {
    setEditable(false);
    onComplete(innerText);
  };

  const edit = (e) => {
    setEditable(true);
  };

  return (
    editable ? (
      <div className="jobRoleEditor" ref={ref} style={{display: 'inline-block'}}>
        <Input
          value={innerText}
          onChange={(e) => setInnerText(e.target.value)}
          onPressEnter={complete}
          onKeyUp={(e) => setInnerText(e.target.value)}
          onKeyDown={(e) => setInnerText(e.target.value)} 
        />
      </div>
    ) : <span onDoubleClick={edit} className={textWrapClassName}>{innerText}</span>
  )
};

export default EditableText;
