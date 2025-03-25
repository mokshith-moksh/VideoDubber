"use client";
import { useRef, useState } from "react";

// Mapping ANSI codes to hex colors
const ansiToHex: Record<string, string> = {
  "ansi-1": "bold",
  "ansi-4": "underline",
  "ansi-30": "#000000", // Black
  "ansi-31": "#FF0000", // Red
  "ansi-32": "#00FF00", // Green
  "ansi-33": "#FFFF00", // Yellow
  "ansi-34": "#0000FF", // Blue
  "ansi-35": "#FF00FF", // Magenta
  "ansi-36": "#00FFFF", // Cyan
  "ansi-37": "#FFFFFF", // White
  "ansi-40": "#000000", // BG Black
  "ansi-41": "#FF0000", // BG Red
  "ansi-42": "#00FF00", // BG Green
  "ansi-43": "#FFFF00", // BG Yellow
  "ansi-44": "#0000FF", // BG Blue
  "ansi-45": "#FF00FF", // BG Magenta
  "ansi-46": "#00FFFF", // BG Cyan
  "ansi-47": "#FFFFFF", // BG White
};

export default function DiscordTextGenerator() {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState(
    "Welcome to <span class='ansi-33'>Rebane</span>'s <span class='ansi-45'><span class='ansi-37'>Discord</span></span> <span class='ansi-31'>C</span><span class='ansi-32'>o</span><span class='ansi-33'>l</span><span class='ansi-34'>o</span><span class='ansi-35'>r</span><span class='ansi-36'>e</span><span class='ansi-37'>d</span> Text Generator!"
  );
  // Function to apply ANSI color classes
  const applyColorToSelection = (ansiClass: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const selectedText = range.toString();
    if (!selectedText) return;

    // Create a span element with ANSI class and inline color
    const span = document.createElement("span");
    span.className = ansiClass;
    if (ansiClass.startsWith("ansi-1")) {
      span.style.fontWeight = "bold";
    } else if (ansiClass.startsWith("ansi-4")) {
      span.style.textDecoration = "underline";
    }
    if (ansiClass.startsWith("ansi-3")) {
      span.style.color = ansiToHex[ansiClass] || "inherit";
    } else {
      span.style.backgroundColor = ansiToHex[ansiClass] || "inherit";
    }

    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);

    setHtmlContent(textAreaRef.current?.innerHTML || "");
  };

  // Convert HTML content to ANSI-formatted Discord text
  const nodesToANSI = (nodes: NodeListOf<ChildNode>, states: any[]) => {
    let text = "";
    for (const node of nodes) {
      if (node.nodeType === 3) {
        text += node.textContent;
        continue;
      }
      if (node.nodeName === "BR") {
        text += "\n";
        continue;
      }

      const ansiCode = +(node as HTMLElement).className.split("-")[1];
      const newState = { ...states.at(-1) };

      if (ansiCode < 30) newState.st = ansiCode;
      if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
      if (ansiCode >= 40) newState.bg = ansiCode;

      states.push(newState);
      text += `\x1b[${newState.st};${
        ansiCode >= 40 ? newState.bg : newState.fg
      }m`;
      text += nodesToANSI((node as HTMLElement).childNodes, states);
      states.pop();
      text += `\x1b[0m`;

      if (states.at(-1).fg !== 2)
        text += `\x1b[${states.at(-1).st};${states.at(-1).fg}m`;
      if (states.at(-1).bg !== 2)
        text += `\x1b[${states.at(-1).st};${states.at(-1).bg}m`;
    }
    return text;
  };

  // Copy ANSI text to clipboard
  const copyToClipboard = () => {
    if (!textAreaRef.current) return;
    const ansiText =
      "```ansi\n" +
      nodesToANSI(textAreaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) +
      "\n```";
    navigator.clipboard.writeText(ansiText);
    alert("Copied as Discord ANSI text!");
  };

  return (
    <div className="p-4">
      <h1>
        Rebane &apos;s Discord <span style={{ color: "#5865F2" }}>Colored</span>{" "}
        Text Generator
      </h1>

      <div className="container">
        <h3>About</h3>
        <p>This app creates colored Discord messages using ANSI codes.</p>
        <p>
          Select text and click a color to apply, then copy it to send in
          Discord.
        </p>
      </div>

      <h2>Create your text</h2>
      <button onClick={() => setHtmlContent("Type here...")} className="button">
        Reset All
      </button>
      <button
        onClick={() => applyColorToSelection("ansi-1")}
        className="button"
      >
        Bold
      </button>
      <button
        onClick={() => applyColorToSelection("ansi-4")}
        className="button"
      >
        Underline
      </button>

      <br />
      <br />
      <strong>FG</strong>
      {Object.keys(ansiToHex)
        .filter((key) => key.startsWith("ansi-3"))
        .map((color) => (
          <button
            key={color}
            onClick={() => applyColorToSelection(color)}
            className="button"
            style={{ backgroundColor: ansiToHex[color] }}
          >
            &nbsp;
          </button>
        ))}

      <br />
      <br />
      <strong>BG</strong>
      {Object.keys(ansiToHex)
        .filter((key) => key.startsWith("ansi-4"))
        .map((color) => (
          <button
            key={color}
            onClick={() => applyColorToSelection(color)}
            className="button"
            style={{ backgroundColor: ansiToHex[color] }}
          >
            &nbsp;
          </button>
        ))}

      <br />
      <br />
      <div className="flex">
        <div
          ref={textAreaRef}
          contentEditable
          suppressContentEditableWarning
          className="w-[300px] min-h-[100px] p-2 border border-gray-300 focus:outline-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <br />
      <button onClick={copyToClipboard} className="button copy">
        Copy text as Discord formatted
      </button>

      <br />
      <br />
      <small className="select-none">
        This is an unofficial tool, not made or endorsed by Discord.
      </small>
    </div>
  );
}
