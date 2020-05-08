import React from 'react';
import snake from './snake.svg';

const ErrorInicator = () => {
    return (
        <div className="error-indicator d-flex flex-column justify-content-center align-items-center">
            <img src={snake} alt="Упс... что-то пошло не так" className="img-fluid error-indicator-img"/>
            <h2 className="error-indicator-title my-2">Упс... что-то пошло не так</h2>
            <p className="error-indicator-desc">Но мы уже взяли необходимое оборудование и идем ловить ошибку</p>
            <p className="error-indicator-desc">(Попробуйте перезагрузить страницу)</p>
        </div>
    );
}

export default ErrorInicator;
