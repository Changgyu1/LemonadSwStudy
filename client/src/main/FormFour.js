import { Editor } from 'react-draft-wysiwyg';
import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../css/NewBoard.css';
import { EditorState } from 'draft-js';

const FormFour = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  return (
    <div>
      <div className="post_1">
        <span className="post_1_title">4</span>
        <h2 className="post_title">S.With을 자세히 소개해주세요.</h2>
      </div>
      <div className="my-block">
        <label for="title" className="titleLabel">
          제목 :
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목을 입력하세요."
          />
        </label>
        <br />
        <Editor
          wrapperClassName="wrapper-class"
          editorClassName="editor"
          toolbarClassName="toolbar-class"
          toolbar={{
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false },
          }}
          placeholder="내용을 작성해주세요."
          localization={{
            locale: 'ko',
          }}
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
        />
      </div>
    </div>
  );
};

export default FormFour;
