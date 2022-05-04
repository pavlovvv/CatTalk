import MainLayout from "../components/MainLayout.jsx";
import s from "../styles/signup.module.css";
import SignUp from '../components/Signup/Signup.jsx'
import { useSelector } from "react-redux";

export default function Signup(props) {

  const key = useSelector(state => state.sign.key)

  return (
    <MainLayout>
        <div className={s.loginpage}>
          <SignUp key={key}/>
        </div>
    </MainLayout>
  );
}
