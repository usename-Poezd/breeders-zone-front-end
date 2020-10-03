import {Pagination as BootstrapPagination, Spinner as BootstrapSpinner} from "react-bootstrap";
import React, { PureComponent } from "react";
import {connect} from "react-redux";
import memoize from 'memoize-one';
import {withRouter} from "next/router";
import qs from "qs";

class Pagination extends PureComponent {
    state = {
        activePage: this.props.defaultActivePage,
        activePageInRouter:  this.props.defaultActivePage,
        request: false
    };

    componentDidMount() {
        const {router} = this.props;
        router.events.on('routeChangeStart', this.routeChangeStart);
        router.events.on('routeChangeComplete', this.routeChangeEnd);
        router.events.on('routeChangeError', this.routeChangeEnd);
    }

    componentWillUnmount() {
        const {router} = this.props;
        router.events.off('routeChangeStart', this.routeChangeStart);
        router.events.off('routeChangeComplete', this.routeChangeEnd);
        router.events.off('routeChangeError', this.routeChangeEnd);
    }

    routeChangeStart = () => this.setState({request: true});

    routeChangeEnd = () => {
        const {activePage} = this.state;
        this.setState({request: false,  activePageInRouter: activePage});
        if (typeof window !== 'undefined')
            window.scrollTo(0, 0)
    };


    // Since we want to not have to worry about when this changes and since it won't change much
    // Memoize will remember the last parameter and only execute when they change
    getNumberOfPages = memoize(
        props => {
            const auxPages = props.totalItems / props.pageSize;
            let pages = parseInt(auxPages, 10);
            pages += pages !== auxPages ? 1 : 0;
            return pages;
        }
    );

    paginationItems = () => {

        if (this.props.defaultActivePage !== this.defaultActivePage) {
            this.defaultActivePage = this.props.defaultActivePage;
            this.activePage = this.defaultActivePage;
        }

        const pages = this.getNumberOfPages(this.props);
        let items = [];
        const { activePage } = this;
        const { firstPageText, previousPageText, nextPageText, lastPageText } = this.props;

        // Since first and last PaginationNumber depend on activepage there's no reason to have them on the state
        // So we just make the calculations when we need them
        const firstPaginationNumber = this.getFirstPaginationNumber(activePage, pages);
        const lastPaginationNumber = this.getLastPaginationNumber(firstPaginationNumber, pages);

        // Elements first and previous
        items.push(this.firstOrLastPagItem(firstPageText, 1));
        items.push(this.nextOrPreviousPagItem(previousPageText, 1, "l"));

        // Page numbers
        for (let i = firstPaginationNumber; i <= lastPaginationNumber; i++) {
            items.push(this.numberedPagItem(i, activePage));
        }
        // Elements next and last
        items.push(this.nextOrPreviousPagItem(nextPageText, pages, "r"));
        items.push(this.firstOrLastPagItem(lastPageText, pages));
        return items;
    };

    getFirstPaginationNumber = (activePage, pages) => {
        const distance = Math.floor(this.props.maxPaginationNumbers / 2);
        const newFPNumber = activePage - distance;
        const newLPNumber = activePage + distance;
        let result = 1;
        if (newFPNumber <= distance) {
            result = 1;
        } else if (newLPNumber <= pages) {
            result = newFPNumber;
        } else if (newLPNumber >= pages) {
            result = pages - this.props.maxPaginationNumbers + 1;
        }
        return result;
    };

    getLastPaginationNumber = (firstPaginationNumber, pages) => {
        const minNumberPages = Math.min(
            pages,
            this.props.maxPaginationNumbers
        );
        return firstPaginationNumber + minNumberPages - 1;
    };

    numberedPagItem = (i, activePage) => {
        let minWidth = "43.5px";
        if (this.props.size === "lg") {
            minWidth = "71px"
        } else if (this.props.size === "sm") {
            minWidth = "33px"
        }
        return (
            <BootstrapPagination.Item
                key={i}
                id={`pagebutton${i}`}
                active={activePage === i}
                onClick={this.handleClick}
            >
                {i}
            </BootstrapPagination.Item>
        );
    };

    nextOrPreviousPagItem = (name, page, direction) => {
        if (name === 'Prev') {
            return (
                <BootstrapPagination.Prev
                    key={name}
                    onClick={e => this.handleSelectNextOrPrevious(direction)}
                />
            )
        } else {
            return (
                <BootstrapPagination.Next
                    key={name}
                    onClick={e => this.handleSelectNextOrPrevious(direction)}
                />
            )
        }
    };

    firstOrLastPagItem = (name, page) => {
        if (name) {
            let event = {
                currentTarget: {
                    getAttribute: () => `pagebutton${page}`
                }
            };
            if (name === 'First') {
                return (
                    <BootstrapPagination.First
                        key={name}
                        disabled={this.activePage === page}
                        onClick={() => this.handleClick(event)}
                    />
                )
            } else {
                return (
                    <BootstrapPagination.Last
                        key={name}
                        disabled={this.activePage === page}
                        onClick={() => this.handleClick(event)}
                    />
                )
            }
        }
    };

    handleClick = event => {
        const newActivePage = parseInt(
            event.currentTarget
                .getAttribute("id")
                .split("pagebutton")
                .pop(),
            10
        );
        this.changePaginationState(newActivePage);
    };

    handleSelectNextOrPrevious = direction => {
        const { activePage, props } = this;
        const pages = this.getNumberOfPages(props);
        if (
            (direction === "r" && activePage === pages) ||
            (direction === "l" && activePage === 1)
        )
            return;

        const newActivePage = direction === "r" ? activePage + 1 : activePage - 1;

        this.changePaginationState(newActivePage);
    };

    changePaginationState = (newActivePage = (this.props.router.query.page ?  Number(this.props.router.query.page) + 1 :  2), scrollToTop = true) => {
        const {router, routerOptions, pathname, changeRequest, search} = this.props;
        const query = qs.parse(search.replace('?', ''));
        this.activePage = newActivePage;
        this.setState({
            activePage: newActivePage
        });
        query.page = newActivePage;
        if (changeRequest) {
            changeRequest()
        }
        router.push(router.pathname, pathname + '?' + qs.stringify(query), routerOptions);
        if (typeof window !== 'undefined' && scrollToTop)
            window.scrollTo(0, 0)
    };

    render() {
        const {isMobile, totalItems, search} = this.props;
        const {activePageInRouter, request} = this.state;
        const query = qs.parse(search.replace('?', ''));
        const newPage = Number(query.page) + 1;
        return (
            <React.Fragment>
                {
                    isMobile && (totalItems !== activePageInRouter ) ?
                        <button className="btn btn-gray h3 mb--10 p--10 w-100" onClick={() => this.changePaginationState( query.page ? newPage : 2, false)}>
                            {
                                request ?
                                    <BootstrapSpinner animation="border" className="color-main"/>
                                    : 'Дальше'
                            }
                        </button>
                        : null
                }
                <BootstrapPagination size={this.props.size} className={this.props.className}>{this.paginationItems()}</BootstrapPagination>
            </React.Fragment>
        );
    }
}

Pagination.defaultProps = {
    maxPaginationNumbers: 5,
    defaultActivePage: 1,
    firstPageText: "First",
    lastPageText: "Last",
    previousPageText: "Prev",
    nextPageText: "Next",
    routerOptions: {}
};

const mapStateToProps = ({router: {location: {pathname, search}}, stats: {isMobile}}) => ({
    pathname,
    search,
    isMobile
});
export default connect(mapStateToProps)(withRouter(Pagination))
