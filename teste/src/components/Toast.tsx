export interface ToastItem {
  id: number;
  message: string;
  icon: string;
  fading: boolean;
}

interface Props {
  toasts: ToastItem[];
}

const Toast: React.FC<Props> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-item ${t.fading ? "toast-fading" : ""}`}
        >
          <span className="toast-icon">{t.icon}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;