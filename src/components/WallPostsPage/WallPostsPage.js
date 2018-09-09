import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import TopBarContainer from 'containers/TopBarContainer';
import PostsSearchForm from 'components/PostsSearchForm';
import DelayedRender from 'components/common/DelayedRender';
import AuthErrorBoundary from 'components/common/AuthErrorBoundary';
import AuthOfferModal from 'components/AuthOfferModal';
import AuthRedirectModal from 'components/AuthRedirectModal';
import PostsPanelContainer from 'containers/PostsPanelContainer';
// import { AUTH_OFFER_DELAY } from 'constants/ui';

import './style.scss';

const WallPostsPage = (props) => {
  const {
    isSearchActive,
    isRedirecting,
    hasAuthOffer,
    authOfferDelay,
    login,
    rejectAuthOffer,
    onStartSearch,
  } = props;

  const authOfferModal = (
    <AuthOfferModal
      onConfirm={login}
      onReject={rejectAuthOffer}
    />
  );

  return (
    <div className="wall-posts-page">
      <TopBarContainer />
      <AuthErrorBoundary>
        <Fragment>
          {hasAuthOffer && authOfferDelay && (
            // TODO: make withDelayedRender HOC ?
            <DelayedRender delay={authOfferDelay}>
              {authOfferModal}
            </DelayedRender>
          )}
          {/* TODO: remove later to show popup without preceding modal */}
          {hasAuthOffer && !authOfferDelay && authOfferModal}
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
  authOfferDelay: PropTypes.number.isRequired,
  hasAuthOffer: PropTypes.bool.isRequired,
  isRedirecting: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  onStartSearch: PropTypes.func.isRequired,
  rejectAuthOffer: PropTypes.func.isRequired,
};

export default WallPostsPage;
