import MainLayout from "../components/MainLayout";
import s from "../styles/sign.module.css";
import SignUp from "../components/Signup/Signup";
import { useAppSelector } from "../typescript/hook";

export default function Signup() {
  const key = useAppSelector((state) => state.sign.key);

  return (
    <MainLayout>
      <div className={s.loginpage}>
        <SignUp key={key} />
      </div>
    </MainLayout>
  );
}
