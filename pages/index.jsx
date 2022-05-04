import MainLayout from "../components/MainLayout.jsx";
import style from "./index.module.css";
import { Button } from "@mui/material";
import { useState } from "react";
import Signup from "../components/Signup/Signup.jsx";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";


export default function Home(props) {
  const [isSign, setSign] = useState(false);

  const [isHidden, setHide] = useState(false);

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

  const key = useSelector(state => state.sign.key)
  const isAuthed = useSelector(state => state.sign.isAuthed)

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
              <Signup key={key}/>
          </motion.div>
        ) : (
          <motion.div
            initial="visible"
            animate="hidden"
            variants={isHidden && moveLeft}
            viewport={{ amount: 0.9555 }}
            className={style.welcome__basic}
          >
            <h1 className={style.welcome__title}>Welcome to CatTalk</h1>
            <h2 className={style.welcome__text}>
              A service for one-time correspondence.
            </h2>
            <h2 className={style.welcome__text}>
              Let`s take a look inside and &nbsp;
              {!isAuthed ? <Button
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
              : 
              <Button
              variant="contained"
              color="success"
            >
              WRITE YOUR FIRST MESSAGE
            </Button>}
              
            </h2>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}

