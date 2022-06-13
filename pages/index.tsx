import { Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import MainLayout from "../components/MainLayout";
import Signup from "../components/Signup/Signup";
import { useAppSelector } from "../typescript/hook";
import style from "./index.module.css";

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

  return (
    <MainLayout>
      <div className={style.welcome}>
        {isSign ? (
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
          >
            <h1 className={style.welcome__title}>Welcome to CatTalk</h1>
            <h2 className={style.welcome__text}>
              A service for one-time conversations.
            </h2>
            <h2 className={style.welcome__text}>
              Let`s into it and &nbsp;
              {!isAuthed ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setHide(true);

                    setTimeout(() => {
                      setSign(true);
                    }, 1000);
                  }}
                >
                  Sign up
                </Button>
              ) : (
                <Link href="/token" passHref>
                  <Button variant="contained" color="success">
                    WRITE YOUR FIRST MESSAGE
                  </Button>
                </Link>
              )}
            </h2>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}

export default function InitialHome() {
  const uniKey = useAppSelector((state) => state.sign.uniKey);
  
  return <Home key={uniKey}/>
}
