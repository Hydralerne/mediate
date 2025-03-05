import EditModal from '../components/settings/EditModal'
import Password from '../components/settings/Password'
import ProfileModal from '../components/settings/ProfileModal'
import UsernameModal from '../components/settings/UsernameModal'

const SettingsModal = ({ route, navigation }) => {
    switch (route.params.modal) {
        case 'ProfileModal':
            return (<ProfileModal route={route} navigation={navigation} />)
        case 'Username':
            return (<UsernameModal route={route} navigation={navigation} />)
        case 'PhoneMail':
            return (<EditModal route={route} navigation={navigation} />)
        case 'Password':
            return (<Password route={route} navigation={navigation} />)
    }
}

export default SettingsModal