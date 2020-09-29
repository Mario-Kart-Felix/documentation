import algoliasearch from "algoliasearch/lite"
import { createRef, default as React, useState } from "react"
import ReactDOM from 'react-dom'
import { navigate } from "@reach/router"
import { InstantSearch } from "react-instantsearch-dom"
import { ThemeProvider } from "styled-components"
import StyledSearchBox from "./styled-search-box"
import StyledSearchResult from "./styled-search-result"
import StyledSearchRoot from "./styled-search-root"
import useClickOutside from "./use-click-outside"
import qs from "qs"

const DEBOUNCE_TIME = 300;

const theme = {
  foreground: "#050505",
  background: "white",
  faded: "#888",
}

var search = location.search

const createURL = state => `?${qs.stringify(state)}`;
const searchStateToUrl = ({ location }, searchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : '';

console.log("location.search: ", location.search)

const urlToSearchState = ( location ) => qs.parse(search.slice(1));

export default function Search({ indices, page, searchQuery, location, history}) {
  //console.log("searchQuery in search component: ", searchQuery) //For Debugging
  const rootRef = createRef()
  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [debouncedSetState, setDebouncedSetState] = useState(null);

  const onSearchStateChange = updatedSearchState => {
    clearTimeout(debouncedSetState);

    setDebouncedSetState(
      setTimeout(() => {
        navigate(
          null,
          {updatedSearchState},
          searchStateToUrl(updatedSearchState),
        );
      }, DEBOUNCE_TIME)
    );

    /*setDebouncedSetState(
        setTimeout(() => {
          history.pushState(
            updatedSearchState,
            null,
            searchStateToUrl(updatedSearchState)
          );
        }, DEBOUNCE_TIME)
      );*/

    setSearchState(updatedSearchState);
  }

  const [hasFocus, setFocus] = useState(false)
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  )
  useClickOutside(rootRef, () => setFocus(false))
  return (
    <ThemeProvider theme={theme}>
      <StyledSearchRoot ref={rootRef}>
        <InstantSearch
          searchClient={searchClient}
          indexName={indices[0].name}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
          createUrl={createURL}
        >
          <StyledSearchBox onFocus={() => setFocus(true)} hasFocus={hasFocus}/>
          <StyledSearchResult
            show={searchState.query && searchState.query.length > 0 && hasFocus && page !== "search"}
            indices={indices}
            header
          />
          <StyledSearchResult
            show={page === "search"}
            indices={indices}
          />
        </InstantSearch>
      </StyledSearchRoot>
    </ThemeProvider>
  )
}