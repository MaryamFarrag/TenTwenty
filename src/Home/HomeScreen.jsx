import React, { useEffect, useRef, useState } from 'react';
import AnimatedTextComponent from '../../components/AnimatedText/AnimatedTextComponent';
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import MainSlider from '../../components/MainSliderComponent/MainSliderComponent';
import ProductSlider from "../../components/ProductsSliderComponent/ProductSliderComponent";

import {clients} from "../../constants/Clients";
import {mainSliderItems} from "../../constants/MainSliderItems";

import './HomeScreen.scss';

export default function HomeScreen() {
    const [isStartTextAnimation,setIsStartTextAnimation] = useState(false);
    const prodcutsRef = useRef(null);

    useEffect(()=>{
        document.addEventListener("scroll",isElementInViewport);
        
        return(()=>{
            document.removeEventListener("scroll",isElementInViewport);
        });
    },[]);
  
    const isElementInViewport = () => {
        var rect = prodcutsRef.current.getBoundingClientRect();
        if(rect.top < window.innerHeight/1.3){
            return setIsStartTextAnimation(true);
        }
    }

    return (
        <React.Fragment>
            {mainSliderItems.map((item,i)=>(
                <link key={i} rel="preload" as="image" href={item.image} />
            ))}
            <HeaderComponent />
            <MainSlider items={mainSliderItems}/>
            <section id="products" ref={prodcutsRef}>
                    <h2 >
                        <AnimatedTextComponent text={"Quality Products"} initialDelay={0} isStart={isStartTextAnimation}/>
                    </h2>
                    <p>
                        <AnimatedTextComponent text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."} initialDelay={.5} increasedDelay={.07} isStart={isStartTextAnimation}/>
                    </p>
                <ProductSlider clients={clients} />
            </section>
        </React.Fragment>
    )
}