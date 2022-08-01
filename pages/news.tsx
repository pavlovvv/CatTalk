import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import React from "react";
import MainLayout from "../components/MainLayout";
import catTalkIcon from "../images/catlogo1.png";
import fileUpload from "../images/fileUpload.png";
import googleIcon from "../images/google-icon.png";
import multiLanguageIcon from "../images/multi-language-icon.png";
import typescriptIcon from "../images/typescript-icon.png";
import s from "../styles/news.module.scss";
import { ILocale, INewsProps } from "../typescript/interfaces/data";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "news"])),
    },
  };
}

const News: React.FC<INewsProps> = (props) => {
  const moveLeft = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: props.isMobile ? 250 : 600,
      opacity: 0,
    },
  };

  const moveRight = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: props.isMobile ? -250 : -600,
      opacity: 0,
    },
  };

  const { t } = useTranslation("news");

  return (
    <MainLayout>
      <div className={s.newsPage}>
        <div className={s.newsPage__panel}>
          <div className={s.container}>
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={moveLeft}
              viewport={{ once: true }}
            >
              <div className={s.title}>{t("update")} 1.4</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div
                    className={s.newsPage__panelText}
                    style={{ maxWidth: "320px" }}
                  >
                    {t("1.4")}
                  </div>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="100px"
                      height="100px"
                      src={"/" + multiLanguageIcon.src}
                      alt="GoogleIcon"
                    />
                    <div
                      className={s.newsPage__panelDate}
                      style={{ alignSelf: "flex-start" }}
                    >
                      01/08/2022
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={moveLeft}
              viewport={{ once: true }}
            >
              <div className={s.title}>{t("update")} 1.3</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="70px"
                      height="70px"
                      src={"/" + googleIcon.src}
                      alt="GoogleIcon"
                    />
                  </div>
                  <div
                    className={s.newsPage__panelText}
                    style={{ maxWidth: "390px" }}
                  >
                    {t("1.3")}
                  </div>
                </div>
                <div
                  className={s.newsPage__panelDate}
                  style={{ alignSelf: "flex-start" }}
                >
                  11/06/2022
                </div>
              </div>
            </motion.section>
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={moveRight}
              viewport={{ once: true }}
            >
              <div className={s.title}>{t("update")} 1.2</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div
                    className={s.newsPage__panelText}
                    style={{ maxWidth: "300px" }}
                  >
                    {t("1.2")}
                  </div>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="80px"
                      height="80px"
                      src={"/" + typescriptIcon.src}
                      alt="TypeScript_logo"
                    />
                  </div>
                </div>
                <div className={s.newsPage__panelDate}>07/06/2022</div>
              </div>
            </motion.section>
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={moveLeft}
              viewport={{ once: true }}
            >
              <div className={s.title}>{t("update")} 1.1</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="125px"
                      height="80px"
                      src={"/" + fileUpload.src}
                      alt="FileUploader"
                    />
                  </div>
                  <div
                    className={s.newsPage__panelText}
                    style={{ maxWidth: "400px" }}
                  >
                    {t("1.1")}
                  </div>
                </div>
                <div
                  className={s.newsPage__panelDate}
                  style={{ alignSelf: "flex-start" }}
                >
                  30/05/2022
                </div>
              </div>
            </motion.section>
            <motion.section
              variants={moveRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className={s.title}>Release 1.0</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div
                    className={s.newsPage__panelText}
                    style={{ maxWidth: "220px" }}
                  >
                    {t("1.0")}
                  </div>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="100px"
                      height="80px"
                      src={"/" + catTalkIcon.src}
                      alt="CatTalk"
                    />
                  </div>
                </div>
                <div className={s.newsPage__panelDate}>24/05/2022</div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default function InitialNews() {
  const mw599px = useMediaQuery("(max-width:599px)");

  return <News key={mw599px ? 0 : 1} isMobile={mw599px} />;
}
