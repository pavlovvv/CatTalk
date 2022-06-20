import { motion } from "framer-motion";
import Image from "next/image";
import MainLayout from "../components/MainLayout";
import catTalkIcon from "../images/catlogo1.png";
import fileUpload from "../images/fileUpload.png";
import typescriptIcon from "../images/typescript-icon.png";
import s from "../styles/news.module.css";
import googleIcon from "../images/google-icon.png";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { INewsProps } from "../typescript/interfaces/data";

const News: React.FC<INewsProps> = (props) => {

  var moveLeft = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: props.isMobile ? 250 : 600,
      opacity: 0,
    },
  };

  var moveRight = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: props.isMobile ? -250 : -600,
      opacity: 0,
    },
  };

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
              <div className={s.title}>Update 1.3</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="70px"
                      height="70px"
                      src={googleIcon.src}
                      alt="GoogleIcon"
                    />
                  </div>
                  <div className={s.newsPage__panelText}>
                    Now you can login using Google account or as guest.
                    <br />
                    All guests delete every day at 3:30 AM by Moscow time.
                    <br />
                    Notice: guests can not have friends 
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
              <div className={s.title}>Update 1.2</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div className={s.newsPage__panelText}>
                    The project was rewritten via TypeScript.
                    <br />
                    Small design changes.
                  </div>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="80px"
                      height="80px"
                      src={typescriptIcon.src}
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
              <div className={s.title}>Update 1.1</div>
              <div className={s.newsPage__panelInner}>
                <div className={s.newsPage__panelInfo}>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="125px"
                      height="80px"
                      src={fileUpload.src}
                      alt="FileUploader"
                    />
                  </div>
                  <div className={s.newsPage__panelText}>
                    A few bugs were fixed.
                    <br />
                    Now you can sent files in chats.
                    <br />
                    For now, you are provided only 1 GB free space and 100 files
                    per day
                    <br />
                    (The limit updates every day at 3:30 AM by Moscow time. At
                    this time also delete all files sent during the day)
                    <br />
                    Also, now you can format your message before sending
                    <br />
                    (** - bold; * - italic etc.)
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
                  <div className={s.newsPage__panelText}>
                    Over a month of development...
                    <br />
                    Over 8k lines of code...
                  </div>
                  <div className={s.newsPage__panelImage}>
                    <Image
                      width="100px"
                      height="80px"
                      src={catTalkIcon.src}
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
}

export default function InitialNews() {
  const mw599px = useMediaQuery("(max-width:599px)");

  return <News key={mw599px ? 0 : 1} isMobile={mw599px}/>
}