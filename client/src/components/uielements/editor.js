import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import EditorWrapper from './styles/editor.style';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    if (this.props.onChange) this.props.onChange(html);
  }

  render() {
    const {theme, value, modules, formats, placeholder, ...rest} = this.props;

    return (
      <EditorWrapper>
        <ReactQuill
          theme={theme}
          onChange={this.handleChange}
          value={value}
          modules={modules}
          formats={formats}
          bounds={'.app'}
          placeholder={placeholder}
          {...rest}
        />
      </EditorWrapper>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

/*
 * PropType validation
 */
Editor.propTypes = {
  theme: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  modules: PropTypes.object,
  formats: PropTypes.array,
  placeholder: PropTypes.string,
};

Editor.defaultProps = {
  theme: 'snow',
  modules: Editor.modules,
  formats: Editor.formats,
  value: ''
};

export default Editor;
