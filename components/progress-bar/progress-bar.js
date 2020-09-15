import React, {Component} from 'react';
import NProgress from 'nprogress';
import {withRouter} from "next/router";

class NextNProgress extends Component {
    static defaultProps = {
        startPosition: 0.3,
        stopDelayMs: 200,
    };

    state = {
        prevUrl: ''
    };

    componentDidMount() {
        const { options, router } = this.props;

        if (options) {
            NProgress.configure(options);
        }

        this.setState({prevUrl: router.asPath}, (url) => {
            router.events.on('routeChangeStart', (url) => this.routeChangeStart(url));
            router.events.on('routeChangeComplete', this.routeChangeEnd);
            router.events.on('routeChangeError', this.routeChangeEnd);
        });



    }

    timer = null;

    routeChangeStart = (url) => {
        const {prevUrl} = this.state;
        let regPrevUrl = null;

        const regUrl = url.match(/(((\/\w+)*\/)([\w\-\.]+[^#?\s]+))(.+)?(#[\w\-]+)?$/);
        if (prevUrl)
            regPrevUrl = prevUrl.match(/(((\/\w+)*\/)([\w\-\.]+[^#?\s]+))(.+)?(#[\w\-]+)?$/);

        if (url.match(/\/(divorces|products)\/edit\/\d$/) === null) {
            if (regUrl !== null && regPrevUrl !== null) {
                if (url !== prevUrl && ( regUrl[1] !== regPrevUrl[1])) {
                    NProgress.set(this.props.startPosition);
                    NProgress.start();
                }
            } else {
                NProgress.set(this.props.startPosition);
                NProgress.start();
            }
        }

        this.setState({prevUrl: url})
    };

    routeChangeEnd = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            NProgress.done(true);
        }, this.props.stopDelayMs);
    };

    render() {
        return <React.Fragment></React.Fragment>;
    }
}

export default withRouter(NextNProgress);
