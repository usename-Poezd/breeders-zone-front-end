import React, {Component} from 'react';
import NProgress from 'nprogress';
import Router, {withRouter} from "next/router";

class NextNProgress extends Component {
    static defaultProps = {
        color: '#29D',
        startPosition: 0.3,
        stopDelayMs: 200,
        height: 3,
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
            Router.events.on('routeChangeComplete', this.routeChangeEnd);
            Router.events.on('routeChangeError', this.routeChangeEnd);
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
        const { color, height } = this.props;

        return (
            <style jsx global>{`
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: ${color};
          position: fixed;
          z-index: 1031;
          top: 0;
          left: 0;
          width: 100%;
          height: ${height}px;
        }
        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
          opacity: 1;
          -webkit-transform: rotate(3deg) translate(0px, -4px);
          -ms-transform: rotate(3deg) translate(0px, -4px);
          transform: rotate(3deg) translate(0px, -4px);
        }
        #nprogress .spinner {
          display: "block";
          position: fixed;
          z-index: 1031;
          top: 15px;
          right: 15px;
        }
        #nprogress .spinner-icon {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          border: solid 2px transparent;
          border-top-color: ${color};
          border-left-color: ${color};
          border-radius: 50%;
          -webkit-animation: nprogresss-spinner 400ms linear infinite;
          animation: nprogress-spinner 400ms linear infinite;
        }
        .nprogress-custom-parent {
          overflow: hidden;
          position: relative;
        }
        .nprogress-custom-parent #nprogress .spinner,
        .nprogress-custom-parent #nprogress .bar {
          position: absolute;
        }
        @-webkit-keyframes nprogress-spinner {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }
        @keyframes nprogress-spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>);
    }
}

export default withRouter(NextNProgress);
