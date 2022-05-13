import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "./Header/Header.jsx";
import reactIcon from '/images/react-icon.png'
import reduxIcon from '/images/redux-icon.webp'
import nodeIcon from '/images/node-js-icon.webp'
import expressIcon from '/images/express-icon.png'
import nextIcon from '/images/nextjs-icon2.png'
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOwnInfo } from "../redux/signSlice";
import { CircularProgress, Avatar } from "@mui/material";
import { useRef } from "react";




function Home({children}) {

  const isAuthFulfilled = useSelector(state => state.sign.isAuthFulfilled)
  const onChatPage = useSelector(state => state.chat.onChatPage)

  const isDone = useRef()
  const dispatch = useDispatch()

  useEffect(
    () => {
      if(!isDone.current) {
        dispatch(getOwnInfo())
        isDone.current = true
      }

    }
  , [])

  return (
    <div>
      <div className={!isAuthFulfilled ? styles.none : styles.undefined}> 
      <Head>
        <title>CatTalk</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
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
      </Head>

      <header className={styles.header}>
        <Header />
      </header>

      <main>
        {children}
        </main>

      {!onChatPage && <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.sections}>
          <section className={styles.leftone}>
            <h3 className={styles.footertitle}>By Alexey Pavlov</h3>
            <ul className={styles.footertitle__items}>
            
            <li className={styles.footertitle__item}>
                <Image
                  src={"https://www.google.com/images/icons/product/googlemail-128.png"}
                  alt="email"
                  className={styles.footertitle__img}
                  width='30px'
                  height='30px'
                />
                uapavlof@gmail.com
              </li>
              <li className={styles.footertitle__item}>
                <Image
                  src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png"}
                  alt="instagram"
                  className={styles.footertitle__img}
                  width='30px'
                  height='30px'
                />
                @alexeypavlov
              </li>
              <li className={styles.footertitle__item}>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png"
                  alt="telegram"
                  className={styles.footertitle__img}
                  width='30px'
                  height='30px'
                />
                +380992143539
              </li>
              <li className={styles.footertitle__item}>
                <Image
                  src="https://play-lh.googleusercontent.com/lB6Ro6pjPw17G8HnTvv_qerC2yMGlvjVpryNXoeKfxyglyB8Ljk1HUxmegKU85acTmQ"
                  alt="viber"
                  className={styles.footertitle__img}
                  width='30px'
                  height='30px'
                />
                +380992143539
              </li>
            </ul>
          </section>

          <section className={styles.rightone}>
            <h3 className={styles.footertitle}>Made with</h3>
            <ul className={styles.footertitle__items}>
              <li className={styles.footertitle__item}>
                <img
                  src={reactIcon.src}
                  alt="react"
                  className={styles.footertitle__img + ' ' + styles.footertitle__reactIcon}
                />
                <img
                  src={reduxIcon.src}
                  alt="redux"
                  className={styles.footertitle__img}
                />
              </li>
              <li className={styles.footertitle__item}>
                <img
                  src={nodeIcon.src}
                  alt="node"
                  className={styles.footertitle__img}
                />
                <img
                  src={expressIcon.src}
                  alt="express"
                  className={styles.footertitle__img}
                />
              </li>
              <li className={styles.footertitle__item + ' ' + styles.footertitle__thirditem}>
                <img
                  src={nextIcon.src}
                  alt="next"
                  className={styles.footertitle__img + ' ' + styles.footertitle__nextIcon}
                />
              </li>
            </ul>
          </section>
        </div>
      </div>
    </footer>
      }

      
      </div>
       
       <div className={isAuthFulfilled ? styles.none : styles.undefined}>
       <div className={styles.preloader}>
         <div className={styles.preloaderitem}>
           <CircularProgress color="secondary" size={100} sx={{display: 'block', margin: 'auto', color: '#fff'}}/>
         </div>
       </div>  
       </div>
      
     
    </div>
  );
}

export default function InitialHome(props) {
  const uniKey = useSelector(state => state.sign.uniKey)

  return <Home key={uniKey} {...props}/>
}
