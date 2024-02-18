import { useEffect, useRef, useState } from "react";
import "./App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

function App() {
  const [value, setValue] = useState();
  const [top, setTop] = useState(12);
  const [btnVisiblity, setBtnVisibility] = useState(true);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const editorRef = useRef(null);

  const modules = {
    toolbar: [
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],
      ["bold", "italic", "link"],
      [{ script: "sub" }, { script: "super" }, "blockquote"],
      ["underline", "strike"],
    ],
  };

  function handleImageInsert() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.onchange = async () => {
      const file = input.files[0];
      if (file && editorRef.current) {
        const imageUrl = URL.createObjectURL(file);
        console.log("Image URL:", imageUrl);
        console.log("File:", file);

        // const formData = new FormData();
        // formData.append('image', file);
        // const response = await fetch('your-image-upload-url', {
        //   method: 'POST',
        //   body: formData
        // });
        // const data = await response.json();
        // const imageUrll = data.imageUrl;
        // console.log(imageUrll, data)

        const editor = editorRef.current.getEditor();
        const imgTag = `<img src="${imageUrl}" alt="${file.name}">`;
        editor.root.innerHTML += imgTag;
      } else {
        console.error("File or editorRef.current is null.");
      }
    };
    input.click();
    setBtnVisibility(false);
    setIsBtnClicked(false);
  }

  function handleVideoInsert() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.onchange = async () => {
      const file = input.files[0];
      if (file && editorRef.current) {
        const videoUrl = URL.createObjectURL(file);
        console.log("Video URL:", videoUrl);
        console.log("File:", file);

        const editor = editorRef.current.getEditor();
        const videoTag = `<video controls src="${videoUrl}" type="${file.type}" alt="${file.name}"></video>`; // Create video tag with src, type, and alt attributes
        editor.root.innerHTML += videoTag; // Append video tag to editor's HTML content

        // Log Quill editor's HTML content to check if video tag is added
        console.log("Editor HTML:", editor.root.innerHTML);
      } else {
        console.error("File or editorRef.current is null.");
      }
    };
    input.click();
  }

  function handleCodeBlockInsert() {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      const cursorPosition = editor.getSelection()?.index || editor.getLength(); // Get current cursor position
      const codeBlock =
        '<pre><code class="language-javascript">// Your code here\n</code></pre><p><br></p>'; // Define code block structure
      editor.clipboard.dangerouslyPasteHTML(cursorPosition, codeBlock); // Insert code block at cursor position
    } else {
      console.error("editorRef.current is null.");
    }
  }

  function onButtonClick() {
    const toolbar = editorRef.current?.editor.getModule("toolbar");
    console.log(editorRef.current);

    setIsBtnClicked((prev) => !prev);
  }

  function setButtonTopOffset(newTop: number) {
    setTop(newTop);
    setBtnVisibility(true);
  }

  function onChangeDetection(e) {
    const a = editorRef.current?.editor?.getLeaf(e?.index);
    if (a === undefined) {
      return;
    }

    const domNode = a[0]?.parent?.domNode;
    const isContentAvailable = domNode?.textContent.length > 0;

    if (!isContentAvailable) {
      setButtonTopOffset(a[0].parent.domNode.offsetTop);
    } else {
      setBtnVisibility(false);
    }
  }

  function handleEditorClick(event) {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      const clickedElement = event.target;
      const codeBlockElement = clickedElement.closest("pre");

      if (codeBlockElement) {
        const newLine = "<p><br></p>"; // Or any other HTML for a new line
        const index = editor.getIndex(codeBlockElement);
        editor.clipboard.dangerouslyPasteHTML(index + 1, newLine); // Insert new line after code block
      }
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          position: "relative",
        }}
      >
        <ReactQuill
          className="quill_input"
          modules={modules}
          theme="bubble"
          value={value}
          onChange={setValue}
          onChangeSelection={(e) => onChangeDetection(e)}
          ref={editorRef}
          placeholder="Tell your story ..."
        />

        {btnVisiblity && (
          <button
            onClick={onButtonClick}
            style={{
              position: "absolute",
              background: "red",
              padding: "5px 10px",
              borderRadius: "7px",
              top: top,
              left: 54,
            }}
          >
            Add
          </button>
        )}

        {isBtnClicked && (
          <div
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              position: "absolute",
              background: "red",
              top: top + 5,
              left: 124,
            }}
          >
            <span onClick={handleImageInsert}>image</span>
            <span onClick={handleVideoInsert}>video</span>
            <span>embed</span>
            <span onClick={handleCodeBlockInsert}>code</span>
          </div>
        )}
      </div>

      <button onClick={() => console.log(value)}>submit</button>
    </>
  );
}

export default App;
