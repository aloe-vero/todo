import { View, Image, Text } from 'react-native';
import logo from '../../assets/images/light/logo.png';
import { light, dark } from './Header.style';
import darklogo from '../../assets/images/dark/darklogo.png';

export default function Header({theme, user}) {


    function changeBannerColor() {
        switch (user?.level) {
            case 'Master': return 'green'
            case 'Average': return 'blue'
            default: return 'red';

        }




    }

    console.log(theme)
    return (<View style={theme === 'dark' ? dark.container : light.container}>
            <View

                style={theme === 'dark' ? dark.logo : light.logo}
            >
                <Image
                    source={theme === 'dark' ? darklogo : logo}
                    style={theme === 'dark' ? dark.img : light.img}
                />
                <Text style={theme === 'dark' ? dark.text : light.text}>
                    Tu as probablement des trucs à faire
                </Text>
            </View>
            <View style={dark.levelBanner} >
                <Text style={[dark.bannerText, {backgroundColor: changeBannerColor()}]}>{user?.level}</Text>
                <Text style={theme === 'dark' ? dark.text : light.text}>{user?.xp} xp</Text>
            </View>
        </View>
    );
}


