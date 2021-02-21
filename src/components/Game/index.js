import React, { useState } from 'react';
import Draggable from 'react-draggable';
import Settings from '../../assets/settings.svg';
import Restart from '../../assets/restart.svg';

import { Link } from 'react-router-dom';

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

    const screenWidth = window.innerWidth;
    const breakpoint = screenWidth / 8;
    const positionsOfEl = [];
    const [moves, setMoves] = useState(0);
    const [ringsAmount, setRingsAmount] = useState(3);
    const rings = ["A", "B", "C", "D", "E", "F", "G", "H"];
    let movableRings = [];
    const [disableList, setDisableList] = useState({
        A: false,
        B: true,
        C: true,
        D: true,
        E: true,
        F: true,
        G: true,
        H: true,
    });
    
    const handleMove = (e) => {
        const currentPos = parseInt(e.target.style.transform.slice(10, -8)) + parseInt(screenWidth / 4) ;
        positionsOfEl.push(currentPos);
    }

    const handleDrop = (e) => {
        const lastPos = positionsOfEl[positionsOfEl.length - 1];
        const ringId = e.target.id;
        const leftArea = document.querySelector('.leftArea');
        const centerArea = document.querySelector('.centerArea');
        const rightArea = document.querySelector('.rightArea');

        let leftChild = 'Z';
        let centerChild = 'Z';
        let rightChild = 'Z';

        let currentStick = document.querySelector(`#${ringId}`).parentElement.className.slice(0, -4);

        if(leftArea.firstChild) leftChild = leftArea.firstChild.id;
        if(centerArea.firstChild) centerChild = centerArea.firstChild.id;
        if(rightArea.firstChild) rightChild = rightArea.firstChild.id;

        if(currentStick === 'left') {
        if(lastPos > breakpoint * 3 && lastPos < breakpoint * 5) {
            if(e.target.id < centerChild) {
            document.querySelector(`#${ringId}`).style.transform = '';
            centerArea.prepend(document.querySelector(`#${ringId}`));
            setMoves(moves + 1);
            }
        } else if(lastPos >= breakpoint * 5) {
            if(e.target.id < rightChild) {
            document.querySelector(`#${ringId}`).style.transform = '';
            rightArea.prepend(document.querySelector(`#${ringId}`));
            setMoves(moves + 1);
            }
        }
        }
    
        if(currentStick === 'center') {
        if(lastPos < breakpoint) {
            if(e.target.id < leftChild) {
            document.querySelector(`#${ringId}`).style.transform = '';
            leftArea.prepend(document.querySelector(`#${ringId}`));
            setMoves(moves + 1);
            }
        } else if(lastPos > breakpoint * 3) {
            if(e.target.id < rightChild) {
            document.querySelector(`#${ringId}`).style.transform = '';
            rightArea.prepend(document.querySelector(`#${ringId}`));
            setMoves(moves + 1);
            }
        }
        }
        if(currentStick === 'right') {
        if(lastPos < breakpoint * 1 && lastPos > breakpoint * -1) {
            if(e.target.id < centerChild) {
            document.querySelector(`#${ringId}`).style.transform = '';
            centerArea.prepend(document.querySelector(`#${ringId}`));
            setMoves(moves + 1);
            }
        } else if(lastPos <= breakpoint * -1) {
            if(e.target.id < leftChild) {
            document.querySelector(`#${ringId}`).style.transform = '';
            leftArea.prepend(document.querySelector(`#${ringId}`));
            setMoves(moves + 1);
            }
        }
        }
        if(leftArea.firstChild) {
        movableRings.push(leftArea.firstChild.id);
        }
        if(centerArea.firstChild) {
        movableRings.push(centerArea.firstChild.id);
        }
        if(rightArea.firstChild) {
        movableRings.push(rightArea.firstChild.id);
        }
        movableRings = [...new Set([...movableRings])]
        let temp = {...disableList};
        for(const el in temp) {
        if(movableRings.includes(el)) {
            temp[el] = false;
        } else {
            temp[el] = true;
        }
        }
        setDisableList({...temp});

        if(rightArea.childNodes.length === ringsAmount) {
            document.querySelector('.end__board').style.top = '0';
        }
    }

    const openSettings = () => {
        document.querySelector('.settings__modal').style.top = '20%';
    }

    const restartGame = () => {  
        document.querySelector('.settings__modal').style.top = '200%';
        document.querySelector('.end__board').style.top = '200%';
        setMoves(0);
        let leftArea = document.querySelector('.leftArea');
        for(let i = 0; i < ringsAmount; i ++) {
            leftArea.appendChild(document.querySelector(`#${rings[i]}`));
        }
        setRingsAmount(parseInt(document.querySelector('.rings__amount').value));
    }
   
    return ( 
        <div className="container">

            <section className="topbar">
                <img onClick={restartGame} className="settings-icon" src={Restart} alt="restart" />
                <img onClick={openSettings} className="settings-icon" src={Settings} alt="settings" />
            </section>
            <main className="game__board">

                <div className="leftArea">
                    {rings.map((ring, q) => {
                    if(q < ringsAmount) {
                        return  <Draggable position={{x: 0, y: 0,}} disabled={disableList[ring]}>
                                <div 
                                id={ring} 
                                className="ring" 
                                onMouseMove={handleMove} 
                                onMouseUpCapture={handleDrop}
                                onTouchMove={handleMove}
                                onTouchEndCapture={handleDrop}> 
                                </div>
                                </Draggable>
                    } else return [];
                    })}
                    
                </div>
                <div className="centerArea"></div>
                <div className="rightArea"></div>
                
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
            <section className="settings__modal">
                <section className="settings__form">
                    <label htmlFor="rings" className="rings__label">AMOUNT OF RINGS</label>
                    <select name="rings" className="rings__amount">
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

            <section className="end__board">
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