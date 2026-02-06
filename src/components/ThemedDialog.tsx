import React from 'react';
import { Dialog, useTheme } from 'react-native-paper';

interface ThemedDialogProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  [key: string]: any;  // forward other Dialog props
}

const ThemedDialog: React.FC<ThemedDialogProps> = ({
  visible,
  onDismiss,
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
        },
        props.style,
      ]}
      {...props}
    >
      {children}
    </Dialog>
  );
};

export default ThemedDialog;
