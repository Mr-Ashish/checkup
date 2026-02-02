import React from 'react';
import { TextInput, View } from 'react-native';

interface ContactInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const ContactInput: React.FC<ContactInputProps> = ({ value, onChangeText, placeholder }) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
        keyboardType="email-address"
      />
    </View>
  );
};

export default ContactInput;