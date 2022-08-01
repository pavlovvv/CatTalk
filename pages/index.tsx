import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import MainLayout from "../components/MainLayout";
import Signup from "../components/Signup/Signup";
import { updUniKey } from "../redux/signSlice";
import { useAppSelector } from "../typescript/hook";
import { ILocale } from "../typescript/interfaces/data";
import { useAppDispatch } from "./../typescript/hook";
import style from "../styles/index.module.scss";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "home"])),
    },
  };
}

const Home: React.FC = () => {
  const [isSign, setSign] = useState<boolean>(false);

  const [isHidden, setHide] = useState<boolean>(false);

  const moveLeft = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: 100,
      opacity: 0,
    },
  };

  const standStill = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: 0,
      opacity: 1,
    },
  };

  const key = useAppSelector((state) => state.sign.key);
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);

  const { t } = useTranslation("home");
  const ct = useTranslation("common").t;
  const st = useTranslation("signUp").t;

  const router = useRouter();
  const welcomeRef = useRef<HTMLDivElement>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (welcomeRef.current?.children.length === 3) {
        welcomeRef.current.style.marginLeft = -(e.pageX * 0.03) + "px";
        welcomeRef.current.style.marginTop = -(e.pageY * 0.03) + "px";
      }
    });
  }, []);

  useEffect(() => {
    if (!router.query.isHidden && welcomeRef.current?.style.marginLeft !== "") {
      dispatch(updUniKey());
    }
  }, [router.query.isHidden]);

  return (
    <MainLayout>
      <div className={style.welcome}>
        {isSign || router.query.isHidden ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={moveLeft}
            viewport={{ amount: 0.9555 }}
          >
            <Signup key={key} />
          </motion.div>
        ) : (
          <motion.div
            initial="visible"
            animate="hidden"
            variants={isHidden ? moveLeft : standStill}
            viewport={{ amount: 0.9555 }}
            className={style.welcome__basic}
            ref={welcomeRef}
          >
            <h1 className={style.welcome__title}>Welcome to CatTalk</h1>
            <h2 className={style.welcome__text}>{t("welcome_text1")}</h2>
            <h2 className={style.welcome__text}>
              {t("welcome_text2")} &nbsp;
              {!isAuthed ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setHide(true);
                    setTimeout(() => {
                      setSign(true);
                      router.push({
                        pathname: "/",
                        query: { isHidden: true },
                      });
                    }, 1000);
                  }}
                >
                  {t("button_text1")}
                </Button>
              ) : (
                <Link href="/token" passHref>
                  <Button variant="contained" color="success">
                    {t("button_text2")}
                  </Button>
                </Link>
              )}
            </h2>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default function InitialHome() {
  const uniKey = useAppSelector((state) => state.sign.uniKey);

  return <Home key={uniKey} />;
}
