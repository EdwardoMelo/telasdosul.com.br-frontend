import React, { useCallback, useEffect, useRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";

type AutoResizeTextareaProps = Omit<TextFieldProps, "multiline"> & {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  minRows?: number;
};

const AutoResizeTextarea = ({
  value,
  onChange,
  minRows = 4,
  ...props
}: AutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minRows * 20)}px`;
  }, [minRows]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <TextField
      {...props}
      multiline
      value={value}
      onChange={(e) => {
        onChange(e);
        requestAnimationFrame(adjustHeight);
      }}
      inputRef={(el) => {
        textareaRef.current = el;
      }}
      minRows={minRows}
      sx={{
        ...props.sx,
        "& .MuiInputBase-input": {
          overflow: "hidden !important",
          resize: "none",
        },
      }}
    />
  );
};

export default AutoResizeTextarea;
