import { Button, SxProps, styled } from "@mui/material";
import { ChangeEventHandler, ReactElement } from "react";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});
type InputFileUploadProps = {
  startIcon?: ReactElement<object>;
  text: string;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  onChange: ChangeEventHandler<HTMLInputElement>;
  multiple?: boolean;
  sx?: SxProps;
};
export const InputFileUpload: React.FC<InputFileUploadProps> = ({
  startIcon,
  text,
  variant = "text",
  color = "inherit",
  onChange,
  multiple = false
}) => {
  return (
    <Button component="label" variant={variant} startIcon={startIcon} color={color} onClick={resetHandler}>
      {text}
      <VisuallyHiddenInput type="file" multiple={multiple} onChange={onChange} />
    </Button>
  );
};

/**
 * reset the input value so we can upload the same file again
 * @param event
 */
function resetHandler(event: React.MouseEvent<HTMLLabelElement>) {
  const input = event.currentTarget.querySelector("input");
  if (input) {
    input.value = "";
  }
}
