import { CircularProgress, useMediaQuery } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { getOwnInfo } from "../redux/signSlice";
import styles from "../styles/Home.module.css";
import { useAppDispatch, useAppSelector } from "../typescript/hook";
import { IHomeProps } from "../typescript/interfaces/data";
import Header from "./Header/Header";
import awss3Icon from "/images/awss3.svg";
import emailIcon from "/images/email_icon.png";
import expressIcon from "/images/express-icon.png";
import instagramIcon from "/images/Instagram_icon.webp";
import nextIcon from "/images/next_icon.png";
import nodeIcon from "/images/node-js-icon.webp";
import reactIcon from "/images/react-icon.png";
import reduxIcon from "/images/redux-icon.webp";
import telegramIcon from "/images/Telegram_icon.webp";
import viberIcon from "/images/viber_icon.png";

const Home: React.FC = ({ children }: IHomeProps) => {
  const isAuthFulfilled = useAppSelector((state) => state.sign.isAuthFulfilled);
  const onChatPage = useAppSelector((state) => state.chat.onChatPage);
  const isDynamicPage = useAppSelector((state) => state.sign.isDynamicPage);

  const isDone = useRef<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isDone.current) {
      dispatch(getOwnInfo());
      isDone.current = true;
    }
  }, []);

  const mw599px = useMediaQuery("(max-width:599px)");

  return (
    <div>
      <div className={!isAuthFulfilled ? styles.none : styles.undefined}>
        <Head>
          <title>CatTalk</title>
          {/* a bug with dynamic pages and deploying */}
          {isDynamicPage && (
            <>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="true"
              />
              <link
                href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
                rel="stylesheet"
              />
              <link
                href="https://fonts.googleapis.com/css2?family=Kanit&family=Quicksand:wght@300&display=swap"
                rel="stylesheet"
              />
              <link
                href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap"
                rel="stylesheet"
              />
              <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
                rel="stylesheet"
              />
            </>
          )}
                  <script src="https://accounts.google.com/gsi/client" async defer /> 
        </Head>
        <header className={styles.header}>
          <Header />
        </header>
        <main>{children}</main>
        {!onChatPage && (
          <footer className={styles.footer}>
            <div className={styles.container}>
              <div className={styles.sections}>
                <section className={styles.leftone}>
                  <h3 className={styles.footertitle}>By Alexey Pavlov</h3>
                  <ul className={styles.footertitle__items}>
                    <li className={styles.footertitle__item}>
                      <Image
                        src={"/" + emailIcon.src}
                        alt="email"
                        className={styles.footertitle__img}
                        width={!mw599px ? "30px" : "25px"}
                        height={!mw599px ? "30px" : "25px"}
                      />
                      uapavlof@gmail.com
                    </li>
                    <li className={styles.footertitle__item}>
                      <Image
                        src={"/" + instagramIcon.src}
                        alt="instagram"
                        className={styles.footertitle__img}
                        width={!mw599px ? "30px" : "25px"}
                        height={!mw599px ? "30px" : "25px"}
                      />
                      @alexeypavlov
                    </li>
                    <li className={styles.footertitle__item}>
                      <Image
                        src={"/" + telegramIcon.src}
                        alt="telegram"
                        className={styles.footertitle__img}
                        width={!mw599px ? "30px" : "25px"}
                        height={!mw599px ? "30px" : "25px"}
                      />
                      +380992143539
                    </li>
                    <li className={styles.footertitle__item}>
                      <Image
                        src={"/" + viberIcon.src}
                        alt="viber"
                        className={styles.footertitle__img}
                        width={!mw599px ? "30px" : "25px"}
                        height={!mw599px ? "30px" : "25px"}
                      />
                      +380992143539
                    </li>
                  </ul>
                </section>

                <section className={styles.rightone}>
                  <h3 className={styles.footertitle}>Made with</h3>
                  <ul className={styles.footertitle__items}>
                    <li className={styles.footertitle__item}>
                      <Image
                        src={"/" + reactIcon.src}
                        alt="react"
                        className={
                          styles.footertitle__img +
                          " " +
                          styles.footertitle__reactIcon
                        }
                        width="35px"
                        height="30px"
                      />
                      <Image
                        src={"/" + reduxIcon.src}
                        alt="redux"
                        className={styles.footertitle__img}
                        width="30px"
                        height="30px"
                      />
                    </li>
                    <li className={styles.footertitle__item}>
                      <Image
                        src={"/" + nodeIcon.src}
                        alt="node"
                        className={styles.footertitle__img}
                        width="30px"
                        height="30px"
                      />
                      <Image
                        src={"/" + expressIcon.src}
                        alt="express"
                        className={styles.footertitle__img}
                        width="30px"
                        height="30px"
                      />
                    </li>
                    <li className={styles.footertitle__item}>
                      <Image
                        src={"/" + awss3Icon.src}
                        alt="aws s3"
                        className={styles.footertitle__img}
                        width="30px"
                        height="30px"
                      />
                      <Image
                        src={"/" + nextIcon.src}
                        alt="next"
                        className={
                          styles.footertitle__img +
                          " " +
                          styles.footertitle__nextIcon
                        }
                        width="30px"
                        height="30px"
                      />
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </footer>
        )}
      </div>

      <div className={isAuthFulfilled ? styles.none : styles.undefined}>
        <div className={styles.preloader}>
          <div className={styles.preloaderitem}>
            <CircularProgress
              color="secondary"
              size={100}
              sx={{ display: "block", margin: "auto", color: "#fff" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InitialHome(props: IHomeProps) {
  const uniKey = useAppSelector((state) => state.sign.uniKey);

  return <Home key={uniKey} {...props} />;
}
