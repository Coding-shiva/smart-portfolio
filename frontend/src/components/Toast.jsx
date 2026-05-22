import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    container: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: '#ffffff',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      background: type === 'success' ? 'var(--success)' : 'var(--danger)',
      animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: 0,
      opacity: 0.8,
    }
  };

  return (
    <div style={styles.container}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</span>
      <button onClick={onClose} style={styles.closeBtn}>
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
