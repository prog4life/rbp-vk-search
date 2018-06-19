import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import TopBarContainer from 'containers/TopBarContainer';
import PostsSearchForm from 'components/PostsSearchForm';
import DelayedRender from 'components/common/DelayedRender';
import AuthErrorBoundary from 'components/common/AuthErrorBoundary';
import AuthOfferModal from 'components/AuthOfferModal';
import AuthRedirectModal from 'components/AuthRedirectModal';
import PostsResultContainer from 'containers/PostsResultContainer';
import { AUTH_OFFER_DELAY } from 'constants/ui';

import './style.scss';

const WallPostsPage = (props) => {
  const {
    isSearchActive,
    isRedirecting,
    isAuthOfferVisible,
    isAuthOfferDelayed,
    redirectToAuth,
    rejectAuthRedirect,
    onStartSearch,
  } = props;

  const authOfferModal = (
    <AuthOfferModal
      onRedirect={redirectToAuth}
      onClose={rejectAuthRedirect}
    />
  );

  return (
    <div className="wall-posts-page">
      <TopBarContainer />
      <AuthErrorBoundary>
        <Fragment>
          {isAuthOfferDelayed &&
            <DelayedRender delay={AUTH_OFFER_DELAY}>
              {authOfferModal}
            </DelayedRender>
          }
          {isAuthOfferVisible && authOfferModal}
        </Fragment>
      </AuthErrorBoundary>
      {isRedirecting && <AuthRedirectModal />}
      <PostsSearchForm
        isSearchActive={isSearchActive}
        onStartSearch={onStartSearch}
      />
      <PostsResultContainer />
    </div>
  );
};

WallPostsPage.propTypes = {
  isAuthOfferDelayed: PropTypes.bool.isRequired,
  isAuthOfferVisible: PropTypes.bool.isRequired,
  isRedirecting: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  onStartSearch: PropTypes.func.isRequired,
  redirectToAuth: PropTypes.func.isRequired,
  rejectAuthRedirect: PropTypes.func.isRequired,
};

export default WallPostsPage;
