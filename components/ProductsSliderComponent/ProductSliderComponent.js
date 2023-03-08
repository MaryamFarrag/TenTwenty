import React, { useState, useRef, useEffect } from 'react';
import './ProductSliderComponent.scss';

const ProductSlider = ({clients}) => {
    const [index, setIndex] = useState(0);
    const [scrollPos, setScrollPos] = useState(100);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(100);
    const [isMobile,setIsMobile] = useState(false);
    const sliderRef = useRef(null);
  
    useEffect(()=>{
        sliderRef.current.scrollLeft = 100;
        if(window.innerWidth < 767){
            setIsMobile(true);
        }
    },[]);


    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.pageX - sliderRef.current.offsetLeft;
            const diffX = newX - startX;
            sliderRef.current.scrollLeft -= diffX;
            setStartX(newX);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const updateSlider = () => {

        const sliderWidth = sliderRef.current.clientWidth;
        const slideWidth = sliderWidth / 3;
        const sliderInner = sliderRef.current.querySelector('.slider-inner');
        const slides = sliderRef.current.querySelectorAll('.slide');

        let newActiveSlideIndex = null;

        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');

          
            const distance = getDistanceFromCenter(slide);
            const rangeStart = (window.innerWidth/2) - (slideWidth/2);
            const rangeEnd = (window.innerWidth /2)+ (slideWidth/2);
            const breakPoint = isMobile?20:100;
            const rect = slide.getBoundingClientRect();
            const slideCenter = rect.left + rect.width / 2;
          
            if (slideCenter > rangeStart && slideCenter < rangeEnd) {//active
                slide.style=`transform:rotate(${distance/breakPoint}deg) translateY(-10px)`;
                newActiveSlideIndex = index;
                slide.classList.add('active');
            } else if (slideCenter < rangeStart) {//prev
                slide.style=`transform:rotate(-${distance/breakPoint}deg) translateY(10px)`
            } else {//next
                slide.style=`transform:rotate(${distance/breakPoint}deg) translateY(10px)`;
                
            }
            setIndex(prev => newActiveSlideIndex || prev); 

        });
        // remove .active from previous active slide
        sliderInner?.querySelector('.slide.active:not(:nth-child(' + (newActiveSlideIndex + 1) + '))')?.classList?.remove('active');
    };
    function getDistanceFromCenter(element) {
        const rect = element.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
        };
        const viewport = {
          width: window.innerWidth
        };
        const viewportCenter = {
          x: viewport.width / 2,
        };
        const distance = Math.sqrt(
          Math.pow(center.x - viewportCenter.x, 2) 
        );
        return distance;
      }
    const handleScroll = () => {
        setScrollPos(sliderRef.current.scrollLeft);
    };

    useEffect(() => {
        updateSlider();
    }, [scrollPos]);


    return (
        <div className='slider-container'>
            <div
                className="product-slider"
                ref={sliderRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <div className="slider-inner">
                <div className="slide">
                          {/* empty slide */}
                        </div>
                    {clients.map((client, i) => (
                        <div className="slide" key={i}>
                            <img
                                key={i}
                                className={i === index ? 'active' : ''}
                                src={client?.image}
                                alt={`Image ${i}`}
                            />
                            <button className={`drag-btn ${isDragging?"hide":""}`}>Drag</button>

                            <h3>{client.title}</h3>
                            <p>{client.location}</p>
                        </div>
                    ))}
                </div>
                
            </div>
           
        </div>
    );
};

export default ProductSlider;

