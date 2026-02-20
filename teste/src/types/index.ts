export interface TokenButtonProps {
  text: string;
  onDelete: () => void;
  onUpdate: (value: string) => void;
}

export interface GeneratedTextProps {
  text: string;
}