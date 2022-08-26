import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';

import styles from './styles.module.css';

export const Banner = () => {
    return (
        <div className={styles.container}>
            <Swiper slidesPerView={1} className={styles.swiper} autoplay={{ delay: 2000, disableOnInteraction: false }} modules={[Autoplay]} loop={true}>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.slideImg}>
                        <img src="/tmp/banner01.png" alt="" />
                    </div>
                </SwiperSlide>
                <SwiperSlide className={styles.slide}>
                    <div className={styles.slideImg}>
                        <img src="/tmp/banner02.png" alt="" />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}