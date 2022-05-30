import Image from 'next/image'
import MainLayout from '../components/MainLayout.jsx'
import s from '../styles/news.module.css'
import catTalkIcon from '../images/catlogo1.png'
import fileUpload from '../images/fileUpload.png'

export default function News(props) {

    return (
        <MainLayout>
            <div className={s.newsPage}>
                <div className={s.newsPage__panel}>
                    <div className={s.container}>
                    <section>
                            <div className={s.title}>
                                Update 1.1
                            </div>
                            <div className={s.newsPage__panelInner} >

                                <div className={s.newsPage__panelInfo}>
                                <div className={s.newsPage__panelImage}>
                                        <Image width='125px' height='80px' src={fileUpload.src} alt='CatTalk'/>
                                    </div>
                                    <div className={s.newsPage__panelText}>
                                    A few bugs were fixed. 
                                    <br />
                                    Now you can sent files in chats. 
                                    <br />
                                    For now, you are provided only 1 GB free space and 100 files per day
                                    <br />
                                    (The limit re-updates every day at 3:30 PM by Moscow. At this time also deletes all files sent during the day) 
                                    </div>
                                </div>
                                <div className={s.newsPage__panelDate} style={{alignSelf: 'flex-start'}}>
                                        30/05/2022
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className={s.title}>
                                Release 1.0
                            </div>
                            <div className={s.newsPage__panelInner}>

                                <div className={s.newsPage__panelInfo}>
                                <div className={s.newsPage__panelText}>
                                    Over a month of development...
                                    <br />
                                    Over 8k lines of code...
                                    </div>
                                    <div className={s.newsPage__panelImage}>
                                        <Image width='100px' height='80px'  src={catTalkIcon.src} alt='CatTalk'/>
                                    </div>
                                </div>
                                <div className={s.newsPage__panelDate}>
                                        24/05/2022
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}