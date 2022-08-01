import MainLayout from "../components/MainLayout";
import s from "../styles/404.module.scss";
import errorIcon from "../images/404.png";
import Image from "next/image";
import { ILocale } from "../typescript/interfaces/data";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "error"])),
    },
  };
}

export default function ErrorComponent() {
  const { t } = useTranslation("error");

  return (
    <MainLayout>
      <div className={s.errorPage}>
        <div className={s.errorPanel}>
          <div className={s.container}>
            <div className={s.errorPage__inner}>
              <h1 className={s.errorPage__title}>Error 404</h1>
              <Image
                src={"/" + errorIcon.src}
                width="155px"
                height="120px"
                alt="404 error"
              />
              {t("not_found")}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
