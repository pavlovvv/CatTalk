import MainLayout from "../../components/MainLayout.jsx";
import Image from "next/image";
import s from "../../styles/profile.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, createTheme, ThemeProvider, Alert, Avatar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";



export async function getServerSideProps({params}) {

  const res = await fetch(`https://cattalkapi.herokuapp.com/users/${params.id}`)
  const user = await res.json();

  return { props: {userData: user} }
}


 export default function Profile(props) {

    const [info, setInform] = useState([])
    const [stats, setStats] = useState([])
    const [friends, setFriends] = useState([])
    const [infoOption, setInfo] = useState("info");
    const [isChanging, setChanging] = useState(false)
    const [isFriendsAdvanced, setFriendsAdvanced] = useState(false)

    useEffect(() => {
 
        if (props.userData) {
 
            setInform(Object.entries(props.userData.info).map(entry => ({[entry[0]]: entry[1]})))
            setStats(Object.entries(props.userData.stats).map(entry => ({[entry[0]]: entry[1]})))
            setFriends(props.userData.friends ) 

        }
    }, [props])
  
  const statistics = [
    "Total chats", "Total messages sent", "Total characters entered"
  ];


  const theme = createTheme({
    palette: {
      secondary: {
        main: "#333C83",
      },
    },
  });

const dispatch = useDispatch()

const isProfileUpdatingConfirmed = useSelector(state => state.sign.isProfileUpdatingConfirmed)

const stringAvatar = name => {
  return {
    children:  `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div>
          <section className={s.top}>
            <div className={s.container}>
              <div className={s.top__items}>
                <div className={s.top__ava}>
                  {info[7]?.avatar ? <Image
                    width="150px"
                    height="150px"
                    className={s.top__img}
                    src={info[7].avatar}
                    alt="content__img"
                  /> :
                  <Avatar {...stringAvatar(info[0]?.name + ' ' + info[1]?.surname)} 
                  sx={{ bgcolor: '#2A2550', width: '150px', height: '150px', fontSize:'35px' }} />
                }
                  
                </div>
                <div className={s.top__logotext}>
                  <h2>{info[0]?.name} {info[1]?.surname}</h2>
                </div>
              </div>
            </div>
          </section>

          <section className={s.info}>
            <div className={s.container}>
              <div className={s.info__inner}>
                <div className={s.panel + " " + s.info__info}>
                  <div> 
                    {isProfileUpdatingConfirmed && <Alert severity="success" color="primary" variant="filled" 
                sx={{backgroundColor:'#4E9F3D', color:'#fff'}}>
                  Updating confirmed
                  </Alert>}

                    {infoOption === "info" ? (
                    <div>        
                      <div className={s.info__menu}>
                      
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ width: "100px" }}
                        >
                          INFO
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ width: "100px" }}
                          onClick={() => {
                            setInfo("stats");
                          }}
                        >
                          STATISTICS
                        </Button>

                      </div>

                      {info.map((e, i) => {
                        const key = Object.keys(e)
                        const value = Object.values(e)

                        return (
                          <div key={i}>
                            {(key[0] !== '_id' && key[0] !== 'instagramLink' && key[0] !== 'avatar') &&
                          <div>
                          <div className={s.info__infoItems}>
                            <span className={s.info__infoItemName}>
                              {key[0]}
                            </span>
                            <span className={s.info__infoItemValue}>
                                  {value[0] ?? "unknown"}
                            </span>
                          </div>

                          {i !== info.length - 3 && (
                            <hr className={s.hrUnder} />
                          )}
                        </div>  
                            }
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <div className={s.info__menu}>
                        <Button
                          variant="contained"
                          sx={{ width: "100px" }}
                          onClick={() => {
                            setInfo("info");
                          }}
                        >
                          INFO
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ width: "100px" }}
                        >
                          STATISTICS
                        </Button>
                      </div>
                      {stats.map((e, i) => {
                        const value = Object.values(e)
                        return (
                          <div key={i}>
                            <div className={s.info__infoItems}>
                              <span className={s.info__infoItemName}>
                                {statistics[i]}
                              </span>
                              <span className={s.info__infoItemValue}>
                               {value[0]}
                              </span>
                            </div>

                            {i !== stats.length - 1 && (
                              <hr className={s.hrUnder} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )} </div> 

                  
                </div>

                <div className={s.panel + " " + s.info__friends}>
                  <h3
                    className={
                      s.title +
                      " " +
                      s.title_center +
                      " " +
                      s.title_fontSize_25px
                    }
                  >
                    Friends
                  </h3>

                  <div className={s.info__friendsItems}>

                  {(friends.length !== 0 && !isFriendsAdvanced) && (<div>
                        {friends.map((e, i) => {
                          
                          return(
                            <div key={i}>
                                {(i <= 2) && (<div
                                className={
                                  s.infoMemberItem +
                                  " " +
                                  s.infoMemberItem_margin_20px0
                                }
                              >
                                <Image
                                  width="75px"
                                  height="75px"
                                  className={s.infoMemberItem__ava}
                                  src={e.img}
                                  alt="ava"
                                />

                                <div className={s.infoMemberItem__text}>
                                  <span className={s.infoMemberItem__name}>
                                    {e.name}
                                  </span>
                                  <br />
                                  <span className={s.infoMemberItem__surname}>
                                    {e.surname}
                                  </span>
                                </div>
                                
                              </div>
                              )}
                              {(i <= 1) && (
                                <hr className={s.hrUnder} />
                              )}
                            </div>
                          )
                        })}
                       
                        {friends.length > 3 && <div className={s.showAndHide} onClick={() => {
                          setFriendsAdvanced(true)
                        }}>
                            Show {friends.length - 3} more 
                        </div>}                        
                            </div>
                    )} 
        
                    {(friends.length !== 0 && isFriendsAdvanced) && (
                      <div>
                        {friends.map((e, i) => {
                          return (
                            <div key={i}>
                              <div
                                className={
                                  s.infoMemberItem +
                                  " " +
                                  s.infoMemberItem_margin_20px0
                                }
                              >
                                <Image
                                  width="75px"
                                  height="75px"
                                  className={s.infoMemberItem__ava}
                                  src={e.img}
                                  alt="ava"
                                />

                                <div className={s.infoMemberItem__text}>
                                  <span className={s.infoMemberItem__name}>
                                    {e.name}
                                  </span>
                                  <br />
                                  <span className={s.infoMemberItem__surname}>
                                    {e.surname}
                                  </span>
                                </div>
                              </div>
                              {i !== friends.length - 1 && (
                                <hr className={s.hrUnder} />
                              )}  
                            </div>
                            
                          );
                        })}
                        <div className={s.showAndHide} onClick={() => {
                          setFriendsAdvanced(false)
                        }}>
                            Hide  
                        </div>
                      </div>
                    )
                    }
                    
                    {friends.length === 0 && (
                        <div>
                        <Alert
                    severity="info"
                    color="primary"
                    variant="filled"
                    sx={{
                      backgroundColor: "rgb(2, 136, 209)",
                      color: "#fff",
                      width: '100%'
                    }}
                  >
                    You have no friends
                  </Alert></div>)}

                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
}

