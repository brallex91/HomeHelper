import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import * as React from "react";
import { IconButton, Menu } from "react-native-paper";

interface OptionsButtonProps {
  size: number;
}

const OptionsButton: React.FC<OptionsButtonProps> = ({ size }) => {
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("User logged out");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<IconButton icon="cog" size={size} onPress={openMenu} />}
    >
      <Menu.Item onPress={handleLogout} title="Log Out" />
    </Menu>
  );
};

export default OptionsButton;
