// src/components/StarRating.js
import React, { useState } from 'react';

const StarRating = ({ rating, onChange, size = 20 }) => {
    const [hover, setHover] = useState(null);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill={index < (hover ?? rating) ? '#FFD700' : '#e4e5e9'}
                    onMouseEnter={() => setHover(index + 1)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => onChange(index + 1)}
                    style={{ cursor: 'pointer' }}
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
};

export default StarRating;
