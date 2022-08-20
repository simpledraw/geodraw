import { editIcon } from "./icons";

type EditIconProps = {
  title?: string;
  name?: string;
  id?: string;
  onClick?(): void;
};

export const EditIcon = (props: EditIconProps) => (
  <button
    className="help-icon"
    onClick={props.onClick}
    type="button"
    title={`${props.title} — ?`}
    aria-label={props.title}
  >
    {editIcon}
  </button>
);
