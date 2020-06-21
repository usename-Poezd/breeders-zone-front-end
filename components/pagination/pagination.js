import {Pagination as BootstrapPagination} from "react-bootstrap";
import React, { PureComponent } from "react";
import {connect} from "react-redux";
import memoize from 'memoize-one';
import {withRouter} from "next/router";

class Pagination extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activePage: this.props.defaultActivePage
        };
    }

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

    changePaginationState = (newActivePage) => {
        const {router, pathname, changeRequest} = this.props;
        const {query} = router;
        this.activePage = newActivePage;
        this.setState({
            activePage: newActivePage
        });
        query.page = newActivePage;
        if (changeRequest) {
            changeRequest()
        }
        router.push(router.pathname, pathname + '?' + qs.stringify(query));
        if (typeof window !== 'undefined')
            window.scrollTo(0, 0)
    };

    render() {
        return <BootstrapPagination size={this.props.size} className={this.props.className}>{this.paginationItems()}</BootstrapPagination>;
    }
}

Pagination.defaultProps = {
    maxPaginationNumbers: 5,
    defaultActivePage: 1,
    firstPageText: "First",
    lastPageText: "Last",
    previousPageText: "Prev",
    nextPageText: "Next",
};

const mapStateToProps = ({router: {location: {pathname, search}}}) => ({
    pathname,
    search
});
export default connect(mapStateToProps)(withRouter(Pagination))