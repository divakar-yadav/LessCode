import React, { useState } from "react";
import "./FileEditor.css";

// Theme for JavaScript syntax
const theme = {
    // Keywords
    "keyword.control": { color: "#FF4500", fontWeight: "bold" }, // e.g., `if`, `else`, `for`
    "keyword.operator": { color: "#FF6347" }, // e.g., `typeof`, `instanceof`
  
    // Variables and Identifiers
    "variable.other": { color: "#FFD700" }, // e.g., user-defined variables
    "variable.language": { color: "#00CED1", fontStyle: "italic" }, // e.g., `this`, `arguments`
    "variable.constant": { color: "#7FFFD4" }, // e.g., `const` variables
    "constant.language": { color: "#DC143C" }, // e.g., `true`, `false`, `null`
    "constant.numeric": { color: "#FF4500" }, // e.g., numbers like `42`, `3.14`
  
    // Strings
    "string.quoted.single": { color: "#32CD32" }, // e.g., 'hello'
    "string.quoted.double": { color: "#32CD32" }, // e.g., "world"
    "string.template": { color: "#00FA9A" }, // e.g., `hello ${world}`
  
    // Functions
    "entity.name.function": { color: "#1E90FF" }, // e.g., function declarations
    "support.function": { color: "#8A2BE2" }, // e.g., built-in functions like `console.log`
  
    // Operators
    "keyword.operator.arithmetic": { color: "#DAA520" }, // e.g., `+`, `-`, `*`, `/`
    "keyword.operator.assignment": { color: "#DA70D6" }, // e.g., `=`, `+=`, `-=`
    "keyword.operator.comparison": { color: "#CD5C5C" }, // e.g., `==`, `===`, `!=`
  
    // Comments
    "comment.line": { color: "#808080", fontStyle: "italic" }, // e.g., `// single-line comments`
    "comment.block": { color: "#808080", fontStyle: "italic" }, // e.g., `/* multi-line comments */`
  
    // Template Literals and Interpolation
    "meta.template.expression": { color: "#00FA9A", fontStyle: "italic" }, // e.g., `${variable}`
  
    // Classes and Objects
    "entity.name.class": { color: "#FF8C00" }, // e.g., class names
    "variable.object.property": { color: "#6A5ACD" }, // e.g., `obj.property`
  
    // Brackets and Punctuation
    "punctuation.bracket": { color: "#B0C4DE" }, // e.g., `{`, `}`, `[`, `]`
    "punctuation.separator": { color: "#708090" }, // e.g., `;`, `,`
  
    // Special Syntax
    "storage.type": { color: "#7B68EE" }, // e.g., `var`, `let`, `const`
    "meta.import": { color: "#20B2AA" }, // e.g., `import` statements
    "meta.export": { color: "#3CB371" }, // e.g., `export` statements
    "meta.block": { color: "#DDA0DD" }, // e.g., `{ block content }`
  
    // Regular Expressions
    "string.regexp": { color: "#FF1493" }, // e.g., `/[a-z]+/g`
  
    // Special Constants
    "constant.other": { color: "#B22222" }, // e.g., `Infinity`, `NaN`
  };
  

// Tokenizer Function for JavaScript
const tokenize = (code) => {
    const rules = [
      { regex: /\b(function|return|if|else|for|while|const|let|var|class|import|export|default)\b/g, type: "keyword.control" },
      { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, type: "string.quoted" },
      { regex: /`([^`\\]|\\.)*`/g, type: "string.template" },
      { regex: /\b(true|false|null|undefined|NaN|Infinity)\b/g, type: "constant.language" },
      { regex: /\b\d+(\.\d+)?\b/g, type: "constant.numeric" },
      { regex: /\/\/[^\n]*/g, type: "comment.line" },
      { regex: /\/\*[\s\S]*?\*\//g, type: "comment.block" },
      { regex: /\b[a-zA-Z_]\w*(?=\()/g, type: "entity.name.function" },
      { regex: /\b[a-zA-Z_]\w*\b/g, type: "variable.other" },
      { regex: /\b(this|arguments)\b/g, type: "variable.language" },
      { regex: /[\+\-\*\/=<>!&|]+/g, type: "keyword.operator" },
      { regex: /[{}[\]();,]/g, type: "punctuation.bracket" },
    ];
  
    const tokens = [];
    let remainingCode = code;
  
    while (remainingCode) {
      let matched = false;
  
      for (const rule of rules) {
        const match = rule.regex.exec(remainingCode);
        if (match && match.index === 0) {
          tokens.push({ text: match[0], type: rule.type });
          remainingCode = remainingCode.slice(match[0].length);
          matched = true;
          break;
        }
      }
  
      if (!matched) {
        tokens.push({ text: remainingCode[0], type: null });
        remainingCode = remainingCode.slice(1);
      }
    }
  
    return tokens;
  };
  

const FileEditor = ({ code, setCode }) => {
  const [highlightedCode, setHighlightedCode] = useState("");

  const handleInputChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    // Tokenize and generate highlighted code
    const tokens = tokenize(newCode);
    const styledCode = tokens
      .map((token) => {
        if (token.type && theme[token.type]) {
          const style = theme[token.type];
          const styleString = Object.entries(style)
            .map(([key, value]) => `${key}: ${value}`)
            .join("; ");
          return `<span style="${styleString}">${token.text}</span>`;
        }
        return token.text;
      })
      .join("");

    setHighlightedCode(styledCode);
  };

  return (
    <div className="file-editor">
      <textarea
        className="editor"
        value={code}
        onChange={handleInputChange}
      />
      <div
        className="highlighted-editor"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
};

export default FileEditor;
