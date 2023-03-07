import React, { useEffect, useLayoutEffect, useState } from 'react';
import './AnimatedTextComponent.scss';


export default function AnimatedTextComponent({text,initialDelay = 0,increasedDelay = .2,isStart = true}) {
    const [finalText,setFinalText] = useState('');
  
    useEffect(()=>{
        if(isStart){
            let textArr = text?.split(" ");
            textArr?.map((word,i)=>{
                textArr[i] = <span className='word' key={i} style={{animationDelay:`${initialDelay+((i+1)*increasedDelay)}s`}}>
                    {word}
                </span>
            });
                
            setFinalText(textArr);
        }
    },[isStart,text])

  return (
    <React.Fragment>
    {finalText}
    </React.Fragment>

  )
}