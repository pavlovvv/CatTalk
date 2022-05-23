import Image from 'next/image'
import MainLayout from '../components/MainLayout.jsx'
import s from '../styles/news.module.css'
import catTalkIcon from '../images/catlogo1.png'

export default function News(props) {

    return (
        <MainLayout>
            <div className={s.newsPage}>
                <div className={s.newsPage__panel}>
                    <div className={s.container}>
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
                                        <Image width='100px' height='80px' src={catTalkIcon.src} alt='CatTalk'/>
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