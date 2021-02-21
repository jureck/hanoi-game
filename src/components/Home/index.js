import React from 'react';

import { Link } from 'react-router-dom';

const Home = () => {

    React.useEffect(() => { 
        if(window.innerWidth < 600) {
            document.querySelector('.rotate').style.top = '0';
        }
        else {
            document.querySelector('.rotate').style.top = '200%';
        }
    }, []);

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

    return (
        <> 
            <p className="title">
                the tower of hanoi game
            </p>
            <p className="header">
                three rules
            </p>
            <p className="rule-first">
                Only rings from top can be moved
            </p>
            <p className="rule-second">
                Only one ring can be moved at a time
            </p>
            <p className="rule-third">
                No ring can be placed on top of the smaller ring
            </p>
            <button className="start">
                <Link to="/game">START GAME</Link>
            </button>

            <section className="rotate">
            <img className="rotate__img" src={require('../../assets/rotate.png')} alt="rotate-screen"/>
                <p className="rotate__info">
                    ROTATE YOUR SCREEN
                </p>
            </section>
        </>
    );
}
 
export default Home;