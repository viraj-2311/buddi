import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

export default function SwiperSlider(props) {
  const { children } = props;
  return <Swiper {...props}>{children}</Swiper>;
}
