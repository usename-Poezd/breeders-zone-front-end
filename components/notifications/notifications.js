import React from "react";
import {Dropdown} from "react-bootstrap";
import {connect} from "react-redux";
import Link from "next/link";

const Notifications = (props) => {
    const {show, user} = props;

    if (!show) {
        return null;
    }

    return (
        <React.Fragment>
            {
                user.notifications.length === 0 ? <p className="p-3 text-nowrap">Нет уведомлений</p> : null
            }
            {
                user.notifications.map( ({id, type, data}, idx) => {
                    switch (type) {
                        case 'App\\Notifications\\ReportNotification':
                            return (
                                <React.Fragment key={id}>
                                    <Dropdown.Item as="div">
                                        <p className="mb-2" style={{lineHeight: 1.3}}>
                                            Хранитель {data.guard.name} {data.guard.surname}, <br/>
                                            отправил жалобу на ваш {data.isProduct ? 'продукт.' : 'развод.'}<br/>
                                            Причина: {data.title}<br/>
                                        </p>
                                        <Link href={`/${data.isProduct ? 'products' : 'divorces'}/edit/[id]`} as={`/${data.isProduct ? 'products' : 'divorces'}/edit/${data.itemId}`}>
                                            <a>
                                                Подробнее
                                            </a>
                                        </Link>
                                    </Dropdown.Item>
                                    {
                                        user.notifications.length !== (idx + 1) ?
                                            <Dropdown.Divider/>
                                            : null
                                    }
                                </React.Fragment>
                            );
                        default:
                            return null
                    }
                })
            }
        </React.Fragment>
    )
};

const mapStateToProps = ({profile: {user}}) => ({
    user
});

export default connect(mapStateToProps)(Notifications);