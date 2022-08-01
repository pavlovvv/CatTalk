import MainLayout from "../components/MainLayout";
import s from "../styles/sign.module.scss";
import SignUp from "../components/Signup/Signup";
import { useAppSelector } from "../typescript/hook";
import { ILocale } from "../typescript/interfaces/data";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

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
