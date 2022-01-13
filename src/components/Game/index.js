import React, { useState, useRef } from 'react';

import Settings from '../../assets/settings.svg';
import Restart from '../../assets/restart.svg';

import { Link } from 'react-router-dom';
import Tower from './Tower';

const Game = () => {

    React.useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth < 600) {
                document.querySelector('.rotate').style.top = '0';
            }
            else {
                document.querySelector('.rotate').style.top = '200%';
            }
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    });


   
    const ringsAmountRef = useRef(null);
    const screenWidth = window.innerWidth;
    const breakpoint = screenWidth / 8;
    const [moves, setMoves] = useState(0);
    const [ringsAmount, setRingsAmount] = useState(3);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [rings, setRings] = useState({
        left: Array.from(Array(ringsAmount).keys()),
        center: [],
        right: []
    });

    const [disabled, setDisabled] = useState({
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
    }); 

    React.useEffect(() => {
        let enabledList = [];
            enabledList.push(rings.left[0], rings.center[0], rings.right[0]);
            enabledList = enabledList.filter(key => key > -1);
            let newDisabled = {
                0: false,
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
                6: true,
                7: true,
            };
            for (const key in newDisabled) {
                newDisabled[key] = !enabledList.includes(Number(key));
            }
            setDisabled({...newDisabled});
    }, [rings]);

    const openSettings = () => {
        setIsSettingsVisible(true);
    }

    const restartGame = () => {  
        setIsCompleted(false);
        setIsSettingsVisible(false);
        setMoves(0);
        const newRingsAmount = Number(ringsAmountRef.current.selectedOptions[0].value);
        setRings({
            left: Array.from(Array(newRingsAmount).keys()),
            center: [],
            right: []
        });
        setRingsAmount(newRingsAmount);
    }

    const getStickOfRing = (ringId) => {
        for (const ring of rings.left) {
            if(ring === ringId) return "left";
        }
        
        for (const ring of rings.center) {
            if(ring === ringId) return "center";
        }
        return "right";
    }

    const moveRing = (ringId, currentStick, selectedStick) => {
        currentStick = currentStick.filter(ring => ring !== ringId);
        selectedStick.unshift(ringId);
        return [currentStick, selectedStick];
    }

    const getTranslateXFromString = (string) => {
        const lastCommaIndex = string.indexOf(",", 20);
        const positionX = string.substring(19, lastCommaIndex);
        return Number(positionX);
    }

    const handleDrop = (ringId, ringsRef) => { 
        const positionCSSProperty = window.getComputedStyle(ringsRef.current[ringId]).getPropertyValue("transform");
        const lastPosition = getTranslateXFromString(positionCSSProperty);
        const currentStick = getStickOfRing(ringId); 

        const leftTopRing = rings.left.length ? rings.left[0] : 9;
        const centerTopRing = rings.center.length ? rings.center[0] : 9;
        const rightTopRing = rings.right.length ? rings.right[0] : 9;

        if(currentStick === "left") {
            if(lastPosition > breakpoint && lastPosition < breakpoint * 3 && ringId < centerTopRing) {
                let [newLeftRings, newCenterRings] = moveRing(ringId, rings.left, rings.center);
                setRings(prevState => ({
                    ...prevState,
                    left: [...newLeftRings],
                    center: [...newCenterRings]
                }));
                setMoves(prevState => prevState + 1);
            } else if (lastPosition > breakpoint * 3 && ringId < rightTopRing) {
                let [newLeftRings, newRightRings] = moveRing(ringId, rings.left, rings.right);
                setRings(prevState => ({
                    ...prevState,
                    left: [...newLeftRings],
                    right: [...newRightRings]
                }));
                setMoves(prevState => prevState + 1);
            }
        }

        if(currentStick === "center") {
            if(lastPosition > breakpoint && ringId < rightTopRing) {
                let [newCenterRings, newRightRings] = moveRing(ringId, rings.center, rings.right);
                setRings(prevState => ({
                    ...prevState,
                    center: [...newCenterRings],
                    right: [...newRightRings]
                }));
                setMoves(prevState => prevState + 1);
            } else if (lastPosition < -breakpoint && ringId < leftTopRing) {
                let [newCenterRings, newLeftRings] = moveRing(ringId, rings.center, rings.left);
                setRings(prevState => ({
                    ...prevState,
                    center: [...newCenterRings],
                    left: [...newLeftRings]
                }));
                setMoves(prevState => prevState + 1);
            }
        }

        if(currentStick === "right") {
            if(lastPosition < -breakpoint && lastPosition > -breakpoint * 3 && ringId < centerTopRing) {
                let [newRightRings, newCenterRings] = moveRing(ringId, rings.right, rings.center);
                setRings(prevState => ({
                    ...prevState,
                    right: [...newRightRings],
                    center: [...newCenterRings]
                }));
                setMoves(prevState => prevState + 1);
            } else if (lastPosition < -breakpoint * 3 && ringId < leftTopRing) {
                let [newRightRings, newLeftRings] = moveRing(ringId, rings.right, rings.left);
                setRings(prevState => ({
                    ...prevState,
                    left: [...newLeftRings],
                    right: [...newRightRings]
                }));
                setMoves(prevState => prevState + 1);
            }
        }
        if(rings.right.length === ringsAmount) {
            setIsCompleted(true);
        }
    }
    
    return ( 
        <div className="container">

            <section className="topbar">
                <img onClick={restartGame} className="settings-icon" src={Restart} alt="restart" />
                <img onClick={openSettings} className="settings-icon" src={Settings} alt="settings" />
            </section>
            <main className="game__board">
                <Tower
                    rings={rings.left}
                    handleDrop={handleDrop}
                    disabled={disabled}
                />
                 <Tower
                    rings={rings.center}
                    handleDrop={handleDrop}
                    disabled={disabled}
                />
                 <Tower
                    rings={rings.right}
                    handleDrop={handleDrop}
                    disabled={disabled}
                />        
                
                <section className="stick__container">
                    <div className="stick"></div>
                    <div className="stick"></div>
                    <div className="stick"></div>
                </section>
                
                <section className="base">
                </section>
            </main>

            <section className="moves">
                <section className="moves__amount">
                    moves  {moves}
                </section>
                <section className="moves__complete">
                    minimum moves to complete  {Math.pow(2, ringsAmount) - 1}
                </section>
            </section>
            <section className={`settings__modal ${ isSettingsVisible ? "visible" : "" }`}>
                <section className="settings__form">
                    <label htmlFor="rings" className="rings__label">AMOUNT OF RINGS</label>
                    <select ref={ringsAmountRef} name="rings" className="rings__amount">
                        <option value="3" className="rings__option">3</option>
                        <option value="4" className="rings__option">4</option>
                        <option value="5" className="rings__option">5</option>
                        <option value="6" className="rings__option">6</option>
                        <option value="7" className="rings__option">7</option>
                        <option value="8" className="rings__option">8</option>
                    </select>
                </section>
                
                <p onClick={restartGame} className="settings__apply">APPLY</p>
            </section>

            <section className={`end__board ${ isCompleted ? "completed" : "" }`}>
                <section className="congrats">
                    <p className="congrats__text-top">congratulations, you have completed the tower of hanoi in</p>
                    <p className="congrats__moves">{moves}</p>
                    <p className="congrats__text-bottom">moves</p>
                </section>
                <section className="congrats__controls">
                    <button className="return">
                        <Link to="/">back to home</Link>
                    </button>
                    <button onClick={restartGame} className="restart">try again</button>
                </section>
            </section>

            <section className="rotate">
            <img className="rotate__img" src={require('../../assets/rotate.png')} alt="rotate-screen"/>
                <p className="rotate__info">
                    ROTATE YOUR SCREEN
                </p>
            </section>

        </div>
    );
}
 
export default Game;