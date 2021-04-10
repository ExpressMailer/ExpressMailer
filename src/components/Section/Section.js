import React from 'react'
import styles from "./Section.module.css";

function Section({ Icon, title, color, selected, onClick }) {
    return (
        <div onClick={onClick} className = {`${styles.section} ${selected && styles.section__selected}`}
            style={{
                borderBottom:`3px solid ${color}`,
                color: `${selected && color}`,
            }}
        >
          <Icon />
          <h4>{title}</h4>  
        </div>
    );
}

export default Section
