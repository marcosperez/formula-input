"use client";
import { useMemo, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import Select, { ActionMeta, SingleValue } from "react-select";
import styles from "./MagicInput.module.css";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

interface FormulaElement {
  value: number | string;
  label: string;
  id: number | string;
  type: "operator" | "item";
  data?: unknown;
}

const RenderFunctions = {
  operator: (item: FormulaElement) => {
    return `<div class="${styles.BadgeItemOperator}" id="${item.id}">${item.label}</div>`;
  },
  item: (item: FormulaElement) => {
    return `<div class="${styles.BadgeItem}" id="${item?.id}">${item.label}</div>`;
  },
};

export function MagicInput() {
  const [elements, setElements] = useState<FormulaElement[]>([]);
  const ContentEditableRef = useRef(null);

  const html = useMemo(() => {
    return elements.map((e) => RenderFunctions[e.type](e)).join("");
  }, [elements]);

  const selectOption = (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    const newElement: FormulaElement = {
      id: Math.random(),
      label: newValue?.value ?? "",
      type: "item",
      data: newValue,
      value: newValue?.value ?? "",
    };
    setElements([...elements, newElement]);
    if (ContentEditableRef.current)
      (ContentEditableRef.current as ContentEditable).el.current.focus();

    // (ContentEditableRef as any).el.focus();
  };

  function handleKeyPress(event: { key: string; preventDefault: () => void }) {
    const allowedKeys = ["(", ")", "/", "*", "-", "+", "Backspace"];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
      return;
    }

    if (event.key === "Backspace") {
      setElements(elements.splice(0, elements.length - 1));
      event.preventDefault();
      return;
    }
    // if (
    //   elements.length > 0 &&
    //   elements[elements.length - 1].type === "operator"
    // ) {
    //   event.preventDefault();
    //   return;
    // }

    const newElement: FormulaElement = {
      id: Math.random(),
      label: event.key,
      type: "operator",
      value: event.key,
    };
    setElements([...elements, newElement]);
    event.preventDefault();
  }

  return (
    <div className={styles.MagicInputContainer}>
      <ContentEditable
        ref={ContentEditableRef}
        html={html}
        disabled={false}
        onKeyDown={handleKeyPress}
        onChange={(e) => e.preventDefault()}
        className={styles.editableDiv}
      />
      <Select options={options} onChange={selectOption} instanceId={"select"} />
    </div>
  );
}
