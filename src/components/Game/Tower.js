import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const Tower = ({ rings, handleDrop, disabled }) => {
    const ringsClasses = ["ring-0", "ring-1", "ring-2", "ring-3", "ring-4", "ring-5", "ring-6", "ring-7"];
    const ringsRef = useRef([]);

    return ( 
        <section className="towerArea">
            {ringsClasses.map((ring, q) => {
                if(rings.includes(q)) {
                    return  <Draggable 
                                key={q} 
                                position={{x: 0, y: 0}} 
                                disabled={disabled[q]}
                                onStop={() => handleDrop(q, ringsRef)}
                            >
                                <div 
                                    ref={el => ringsRef.current[q] = el}
                                    id={ring} 
                                    className="ring"
                                />
                            </Draggable>
            } else return null
            }).filter(ring => ring !== undefined)}
        </section>
    );
}
 
export default Tower;