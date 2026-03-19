import { Button, Text, View } from "react-native";

interface IProfileScreen {
    navigation: any;
}

export const ProfileScreen: React.FC<IProfileScreen> = ({ navigation }) => {
    return (
        <View>
            <Text>Profile</Text>
        </View>
    );
}