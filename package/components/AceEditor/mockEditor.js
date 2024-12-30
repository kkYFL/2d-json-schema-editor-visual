var ace = require("2d-brace");
require("2d-brace/mode/json");

function run(options) {
  var editor, mockEditor, rhymeCompleter;
  function handleJson(json) {
    var curData = mockEditor.curData;
    try {
      curData.text = json;
      var obj = JSON.parse(json);
      curData.format = true;
      curData.jsonData = obj;
    } catch (e) {
      curData.format = e.message;
    }
  }
  options = options || {};
  var container, data;
  container = options.container || "mock-editor";
  if (
    options.wordList &&
    typeof options.wordList === "object" &&
    options.wordList.name &&
    options.wordList.mock
  ) {
    wordList.push(options.wordList);
  }
  data = options.data || "";
  options.readOnly = options.readOnly || false;
  options.fullScreen = options.fullScreen || false;

  editor = ace.edit(container);
  editor.$blockScrolling = Infinity;
  editor.getSession().setMode("ace/mode/json");
  if (options.readOnly === true) {
    editor.setReadOnly(true);
    editor.renderer.$cursorLayer.element.style.display = "none";
  }
  editor.setOptions({
    useWorker: true,
  });
  editor._fullscreen_yapi = options.fullScreen;
  mockEditor = {
    curData: {},
    getValue: () => mockEditor.curData.text,
    setValue: function (data) {
      editor.setValue(handleData(data));
    },
    editor: editor,
    options: options,
    insertCode: (code) => {
      let pos = editor.selection.getCursor();
      editor.session.insert(pos, code);
    },
  };

  function handleData(data) {
    data = data || "";
    if (typeof data === "string") {
      return data;
    } else if (typeof data === "object") {
      return JSON.stringify(data, null, "  ");
    }
  }

  function isJSON(str) {
    try {
      const parsed = JSON.parse(str); // 尝试解析字符串
      return typeof parsed === "object" && parsed !== null; // 确保是对象或数组
    } catch (error) {
      return false; // 捕获解析错误
    }
  }

  function isFormattedJSON(jsonString) {
    try {
      // 尝试解析字符串，验证其是否为合法 JSON
      JSON.parse(jsonString);
      // 如果包含换行符或缩进字符，则认为是格式化的
      if (
        jsonString.includes("\n") ||
        jsonString.includes("\t") ||
        / {2,}/.test(jsonString)
      ) {
        return true; // 是格式化的
      } else {
        return false; // 是非格式化的
      }
    } catch (error) {
      return false;
    }
  }

  mockEditor.setValue(handleData(data));
  handleJson(editor.getValue());

  editor.clearSelection();

  editor.getSession().on("change", () => {
    const txt = editor.getValue()
    handleJson(txt);
    if (typeof options.onChange === "function") {
      options.onChange.call(mockEditor, mockEditor.curData);
    }
    editor.clearSelection();
  });

  return mockEditor;
}

module.exports = run;
