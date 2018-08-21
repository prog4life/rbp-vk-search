import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import TopBarContainer from 'containers/TopBarContainer';
import PostsSearchForm from 'components/PostsSearchForm';
import DelayedRender from 'components/common/DelayedRender';
import AuthErrorBoundary from 'components/common/AuthErrorBoundary';
import AuthOfferModal from 'components/AuthOfferModal';
import AuthRedirectModal from 'components/AuthRedirectModal';
import PostsPanelContainer from 'containers/PostsPanelContainer';
import { AUTH_OFFER_DELAY } from 'constants/ui';

import './style.scss';

const WallPostsPage = (props) => {
  const {
    isSearchActive,
    isRedirecting,
    hasAuthOffer,
    hasDelayedAuthOffer,
    redirectToAuth,
    rejectAuthOffer,
    onStartSearch,
  } = props;

  const authOfferModal = (
    <AuthOfferModal
      onRedirect={redirectToAuth}
      onClose={rejectAuthOffer}
    />
  );

  return (
    <div className="wall-posts-page">
      <TopBarContainer />
      <AuthErrorBoundary>
        <Fragment>
          {hasDelayedAuthOffer && (
            // TODO: make withDelayedRender HOC ?
            <DelayedRender delay={AUTH_OFFER_DELAY}>
              {authOfferModal}
            </DelayedRender>
          )}
          {hasAuthOffer && authOfferModal}
        </Fragment>
      </AuthErrorBoundary>
      {isRedirecting && <AuthRedirectModal />}
      <PostsSearchForm
        isSearchActive={isSearchActive}
        onStartSearch={onStartSearch}
      />
      <PostsPanelContainer />
    </div>
  );
};

WallPostsPage.propTypes = {
  hasAuthOffer: PropTypes.bool.isRequired,
  hasDelayedAuthOffer: PropTypes.bool.isRequired,
  isRedirecting: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  onStartSearch: PropTypes.func.isRequired,
  redirectToAuth: PropTypes.func.isRequired,
  rejectAuthOffer: PropTypes.func.isRequired,
};

export default WallPostsPage;
