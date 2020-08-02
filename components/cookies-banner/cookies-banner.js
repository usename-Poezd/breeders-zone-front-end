import {AnimatePresence, motion} from "framer-motion"
import React, {useState} from "react";
import {Container} from "react-bootstrap";
import nookies from "nookies";

const CookiesBanner = (props) => {
    const cookies = nookies.get();
    const [isOpen, setOpen] = useState(false);

    if (!isOpen && !cookies.acceptCookies) {
        setTimeout(() => setOpen(true), 5000);
    }

    return (
        <AnimatePresence>
            {
                isOpen && !cookies.acceptCookies ?
                    (
                        (
                            <motion.div
                                positionTransition
                                initial={{ height: 0, transition: { duration: 1 } }}
                                animate={{ height: '100%', transition: { duration: 0.5 } }}
                                exit={{ height: 0, transition: { duration: 0.3 } }}
                                className="cookies"
                            >
                                <Container fluid>
                                    <div className="d-flex align-items-center">
                                        <p className="pr-3">Наш сайт сохраняет небольшие фрагменты текстовой информации (cookies) на вашем устройстве, чтобы предоставлять более качественный контент и в статистических целях. Вы можете отключить использование cookies, изменив настройки вашего браузера. Просматривая наш веб-сайт без изменения настроек браузера, вы даете нам разрешение хранить эту информацию на вашем устройстве.</p>
                                        <button
                                            className="btn btn-main text-nowrap"
                                            onClick={
                                                () => {
                                                    nookies.set(null, 'acceptCookies', true, {
                                                        expires: new Date('01 January 30 00:00:00 UTC')
                                                    });
                                                    setOpen(false)
                                                }
                                            }
                                        >
                                            Я соглашаюсь
                                        </button>
                                    </div>
                                </Container>
                            </motion.div>
                        )
                    )
                    : null
            }

        </AnimatePresence>
    );
};

export default CookiesBanner;
