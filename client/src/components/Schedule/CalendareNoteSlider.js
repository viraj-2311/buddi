import React, {useEffect, useRef, useState} from 'react';
import CalendarNoteSliderModal from './CalendareNoteSlider.style';
import MultiplyIcon from '@iso/components/icons/Multiply';
import TrashIcon from '@iso/components/icons/Trash';
import Button from '@iso/components/uielements/button';
import SwiperSlider from '@iso/components/shared/SwiperSlider';

const CalendarNoteSlider = ({note, modalVisible, onClose, onDelete}) => {
  const images = note?.images || [];

  const gallerySwiperRef = useRef(null);
  const thumbnailSwiperRef = useRef(null);

  useEffect(() => {
    if (!gallerySwiperRef.current || !thumbnailSwiperRef.current) return;

    const gallerySwiper = gallerySwiperRef.current.swiper;
    const thumbnailSwiper = thumbnailSwiperRef.current.swiper;
    if (gallerySwiper.controller && thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }

  }, [images]);

  const gallerySwiperParams = {
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  };
  const thumbnailSwiperParams = {
    spaceBetween: 10,
    centeredSlides: false,
    slidesPerView: 'auto',
    touchRatio: 0.2,
    slideToClickedSlide: true
  };

  const handleCancel = () => {
    onClose();
  };

  const onImageDelete = (index)=> {
    onDelete(note.id, index)
  };

  if (!images.length) return null;

  return (
    <CalendarNoteSliderModal
      visible={modalVisible}
      closeIcon={<MultiplyIcon width={16} height={16} fill="#ffffff" />}
      onCancel={handleCancel}
      width={620}
      footer={null}
      maskClosable={false}
    >
      <div className="media">
        <div className="fullSlider">
          <SwiperSlider {...gallerySwiperParams} ref={gallerySwiperRef}>
            {images.map((image, index) => (
              <div className="slide">
                <img
                  key={`full-${index}`}
                  src={image}
                  alt={index}
                />
                {onDelete &&
                  <Button
                    type="link" className="removeImgBtn"
                    onClick={() => onImageDelete(index)}
                  >
                    <TrashIcon fill="#ffffff" /> Delete
                  </Button>
                }
              </div>
            ))}

          </SwiperSlider>
        </div>
        <div className="thumbSlider">
          <SwiperSlider {...thumbnailSwiperParams} ref={thumbnailSwiperRef}>
            {images.map((image, index) => (
              <img
                key={`thumb-${index}`}
                src={image}
                alt={index}
              />
            ))}
          </SwiperSlider>
        </div>
      </div>
    </CalendarNoteSliderModal>
  )
};

export default CalendarNoteSlider;