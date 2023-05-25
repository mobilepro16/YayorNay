import {createStackNavigator} from 'react-navigation';
import Dashboard from '../Pages/Dashboard';
import Chat from '../Pages/Chat';
import Profile from '../Pages/Profile';
import LoginSplash from '../Pages/LoginSplash';
import Login from '../Pages/Login';
import ForgotPassword from '../Pages/ForgotPassword';
import SignUp from '../Pages/SignUp';
import ConfirmEmail from '../Pages/ConfirmEmail';
import CompleteProfile from '../Pages/CompleteProfile';
import TellUsBit from '../Pages/TellUsBit';
import AskStylist from '../Pages/AskStylist';
import NewCloset from '../Pages/NewCloset';
import ProfileEdit from '../Pages/ProfileEdit';
import MyFit from '../Pages/MyFit';
import MyAccount from '../Pages/MyAccount';
import Tastes from '../Pages/Tastes';
import Camera from '../Pages/Camera';
import Admin from '../Pages/Admin';
import AdminProfile from '../Pages/AdminProfile';
import ClosetDetail from '../Pages/ClosetDetail';
import AboutUs from '../Pages/AboutUs';

const mainNavigator = createStackNavigator(
  {
    Dashboard: { screen: Dashboard },
    Chat: { screen: Chat },
    Profile: { screen: Profile },
    LoginSplash: { screen: LoginSplash },
    Login: { screen: Login },
    ForgotPassword: { screen: ForgotPassword },
    SignUp: { screen: SignUp },
    ConfirmEmail: { screen: ConfirmEmail },
    CompleteProfile: { screen: CompleteProfile },
    TellUsBit: { screen: TellUsBit },
    AskStylist: { screen: AskStylist },
    NewCloset: { screen: NewCloset },
    ProfileEdit: { screen: ProfileEdit },
    MyFit: { screen: MyFit },
    MyAccount: { screen: MyAccount },
    Tastes: { screen: Tastes },
    Camera: { screen: Camera },
    Admin: { screen: Admin },
    AdminProfile: { screen: AdminProfile },
    ClosetDetail: { screen: ClosetDetail },
    AboutUs: { screen: AboutUs }
  },
  {
    initialRouteName: 'LoginSplash',
    headerMode: 'none',
    navigationOptions: {
      header: false,
    },
  });

export default mainNavigator;
