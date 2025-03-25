"use client";
import { useRef, useState } from "react";
import { Button, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useClipboard } from "@mantine/hooks";

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
  const clipboard = useClipboard();
  const [htmlContent, setHtmlContent] = useState(
    "Welcome to <span class='ansi-33'></span> <span class='ansi-45'><span class='ansi-37'>Discord</span></span> <span class='ansi-31'>C</span><span class='ansi-32'>o</span><span class='ansi-33'>l</span><span class='ansi-34'>o</span><span class='ansi-35'>r</span><span class='ansi-36'>e</span><span class='ansi-37'>d</span> Text Generator!"
  );
  const applyColorToSelection = (ansiClass: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const selectedText = range.toString();
    if (!selectedText) return;

    const span = document.createElement("span");
    span.className = ansiClass;
    if (ansiClass.startsWith("ansi-1")) {
      span.style.fontWeight = "bold";
    } else if (ansiClass == "ansi-4") {
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

  const copyToClipboard = () => {
    if (!textAreaRef.current) return;
    const ansiText =
      "```ansi\n" +
      nodesToANSI(textAreaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) +
      "\n```";
    clipboard.copy(ansiText);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Group
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Button
          onClick={() => setHtmlContent("Type here...")}
          className="button"
        >
          Reset All
        </Button>
        <Button
          onClick={() => applyColorToSelection("ansi-1")}
          className="button"
        >
          Bold
        </Button>
        <Button
          onClick={() => applyColorToSelection("ansi-4")}
          className="button"
        >
          Underline
        </Button>
      </Group>

      <br />
      <br />
      <Group className="flex gap-5">
        <h2>FG</h2>
        <Group className="flex gap-10">
          {Object.keys(ansiToHex)
            .filter((key) => key.startsWith("ansi-3"))
            .map((color) => (
              <Button
                key={color}
                onClick={() => applyColorToSelection(color)}
                className="button"
                style={{ backgroundColor: ansiToHex[color] }}
              >
                &nbsp;
              </Button>
            ))}
        </Group>
      </Group>
      <Group className="flex gap-5">
        <h2>BG</h2>
        <Group className="flex gap-10">
          {Object.keys(ansiToHex)
            .filter((key) => key.startsWith("ansi-4"))
            .map((color) => (
              <Button
                key={color}
                onClick={() => applyColorToSelection(color)}
                className="button"
                style={{ backgroundColor: ansiToHex[color] }}
              >
                &nbsp;
              </Button>
            ))}
        </Group>
      </Group>
      <br />
      <div
        style={{
          padding: "24px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          ref={textAreaRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            width: "100%",
            maxWidth: "800px",
            minHeight: "100px",
            maxHeight: "500px",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            overflowY: "auto",
            resize: "both",
            border: "4px solid black",
            outline: "none",
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <br />
      <Tooltip
        label="Link copied!"
        offset={5}
        position="bottom"
        radius="xl"
        transitionProps={{ duration: 100, transition: "slide-down" }}
        opened={clipboard.copied}
      >
        <Button
          variant="light"
          rightSection={
            clipboard.copied ? (
              <IconCheck size={20} stroke={1.5} />
            ) : (
              <IconCopy size={20} stroke={1.5} />
            )
          }
          radius="xl"
          size="md"
          pr={14}
          h={48}
          styles={{ section: { marginLeft: 22 } }}
          onClick={copyToClipboard}
          className="button copy"
        >
          Copy text as Discord formatted
        </Button>
      </Tooltip>

      <br />
      <br />
      <small className="select-none">
        This is an unofficial tool, not made or endorsed by Discord.
      </small>
    </div>
  );
}
