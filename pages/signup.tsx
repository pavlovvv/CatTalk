import MainLayout from "../components/MainLayout";
import s from "../styles/sign.module.css";
import SignUp from "../components/Signup/Signup";
import { useAppSelector } from "../typescript/hook";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ILocale } from "../typescript/interfaces/data";
import { useTranslation } from 'next-i18next';

export async function getStaticProps({locale}: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'signUp'])),
    },
  };
}

export default function Signup() {
  const key = useAppSelector((state) => state.sign.key);

  const {t} = useTranslation('signUp')
  const ct = useTranslation('common').t

  return (
    <MainLayout>
      <div className={s.loginpage}>
        <SignUp key={key} t={t} ct={ct} />
      </div>
    </MainLayout>
  );
}
