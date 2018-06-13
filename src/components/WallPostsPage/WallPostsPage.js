import React from 'react';
import PropTypes from 'prop-types';

import TopBarContainer from 'containers/TopBarContainer';
import PostsSearchForm from 'components/PostsSearchForm';
import ResultsPanel from 'components/ResultsPanel';
import FoundPostsList from 'components/FoundPostsList';
import SearchInResultsFilter from 'components/SearchInResultsFilter';
import DelayedRender from 'components/common/DelayedRender';
import ErrorBoundary from 'components/common/ErrorBoundary';
import RedirectToAuthModal from 'components/RedirectToAuthModal';
// import PostsResultContainer from 'containers/PostsResultContainer';

import './style.scss';

const WallPostsPage = (props) => {
  const {
    isSearchActive,
    isRedirecting,
    hasAuthOffer,
    posts,
    redirectToAuth,
    cancelAuthRedirect,
    onStartSearch,
  } = props;

  return (
    <div className="wall-posts-page">
      <TopBarContainer />
      {(hasAuthOffer || isRedirecting) &&
        <ErrorBoundary>
          <DelayedRender delay={3000}>
            <RedirectToAuthModal
              isRedirecting={isRedirecting}
              onRedirectClick={redirectToAuth}
              onCancelRedirect={cancelAuthRedirect}
            />
          </DelayedRender>
        </ErrorBoundary>
      }
      <PostsSearchForm
        isSearchActive={isSearchActive}
        onStartSearch={onStartSearch}
      />
      <ResultsPanel heading={<SearchInResultsFilter />}>
        <FoundPostsList posts={posts} />
      </ResultsPanel>
    </div>
  );
};

WallPostsPage.propTypes = {
  cancelAuthRedirect: PropTypes.func.isRequired,
  hasAuthOffer: PropTypes.bool.isRequired,
  isRedirecting: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object),
  redirectToAuth: PropTypes.func.isRequired,
};

WallPostsPage.defaultProps = {
  posts: null,
};

export default WallPostsPage;
