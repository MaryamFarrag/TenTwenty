import React, { useState, useRef, useEffect } from 'react';
import './ProductSliderComponent.scss';

const getDistanceFromCenter = (element) => {
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
};

const ProductSlider = ({clients}) => {
    const [index, setIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [isMobile,setIsMobile] = useState(false);

    const [slidesRefs, setSlidesRefs] = useState([]);
    const [activeSlide,setActiveSlide] = useState();
    const sliderRef = useRef(null);
    const sliderInner = useRef(null);

    useEffect(()=>{
        if(window.innerWidth < 767){
            setIsMobile(true);
        };

        setSlidesRefs((slidesRefs)=>(
            Array(clients.length)
            .fill()
            .map((_, i) => slidesRefs[i] || React.createRef())
        ));
        setStartX(1)
    },[]);

    useEffect(() => {
        updateSlider();
        return () =>{}
    }, [startX]);

    useEffect(() => {
        if(!isDragging && activeSlide){
            scrollToCenter()
            
        }
        return () =>{}
    }, [isDragging]);
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

    const updateSlider =() => {
        const sliderWidth = sliderRef.current.clientWidth;
        const slideWidth = sliderWidth / 3;
        const sliderInner = sliderInner?.current;
        let newActiveSlideIndex = null;

        slidesRefs.forEach((slide, index) => {
            slide = slide.current;
            slide.classList.remove('active', 'prev', 'next');
            const distance = getDistanceFromCenter(slide);
            const rangeStart = (window.innerWidth/2.4) - (slideWidth/2);
            const rangeEnd = (window.innerWidth /1.7)+ (slideWidth/2);
            const translateBreakPoint = isMobile?20:100;
            const rotateBreakPoint = isMobile?30:100;
            const rect = slide.getBoundingClientRect();
            const slideCenter = rect.left + rect.width / 2;
            const distancePercentage = distance/(window.innerWidth/2);
            // const translateY = (120 * distancePercentage) - 10;//linear equation
            const y = (translateBreakPoint * Math.tan(distancePercentage * Math.PI/4));//arc equation
            let rotate = distance/rotateBreakPoint;
            if(slideCenter < window.innerWidth/2){
                rotate = -rotate;
            }

            slide.style=`rotate:${rotate}deg; transform:translateY(${y}px);`;

            if (slideCenter > rangeStart && slideCenter < rangeEnd) {//active
                newActiveSlideIndex = index;
                setActiveSlide(slide);
                slide.classList.add('active');
            } 
            setIndex(prev => newActiveSlideIndex || prev); 
        });
        // remove .active from previous active slide
        sliderInner?.querySelector('.slide.active:not(:nth-child(' + (newActiveSlideIndex + 1) + '))')?.classList?.remove('active');
    };

    const scrollToCenter = () =>{
        let distance = getDistanceFromCenter(activeSlide);
        const rect = activeSlide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        if(slideCenter < window.innerWidth/2){
            distance = -distance;
        }
        if(distance != 0){
            setTimeout(() => {
                sliderRef.current.scrollBy({
                    left:distance,
                    behavior: 'smooth'
                }) 
            }, 500);
        }
    }
   
    const handleScroll = () =>{
        updateSlider();
    }   


    return (
        <div className='slider-container'>
            <div
                className="product-slider"
                ref={sliderRef}
                onScroll={handleScroll}
                onPointerDown={handleMouseDown}   
                onPointerMove={handleMouseMove}
                onPointerUp={handleMouseUp}
            >
                <div className="slider-inner" ref={sliderInner}>
                <div className="slide empty">
                          {/* empty slide */}
                        </div>
                    {clients.map((client, i) => (
                        <div className="slide" key={i} ref={slidesRefs[i]}
                        >
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
                     <div className="slide empty">
                          {/* empty slide */}
                        </div>
                </div>
                
            </div>
           
        </div>
    );
};

export default ProductSlider;

