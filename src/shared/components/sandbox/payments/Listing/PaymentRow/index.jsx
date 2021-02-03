/**
 * Payment row in payments listing.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { config, Link } from 'topcoder-react-utils';
import { Avatar } from 'topcoder-react-ui-kit';
import { getCdnAvatarUrl } from 'utils/tc';

import PaymentStatus from '../PaymentStatus';
import TrackAbbreviationTooltip from '../../../../challenge-listing/Tooltips/TrackAbbreviationTooltip';
import TrackIcon from '../../../../TrackIcon';
import './style.scss';

export default function PaymentRow({ challenge }) {
  let winner = challenge.winners || [];
  [winner] = winner.filter(x => parseInt(x.placement, 10) === 1);

  const legacyTracksMapping = {
    Development: 'DEVELOP',
    Design: 'DESIGN',
    'Data Science': 'DATA_SCIENCE',
    'Quality Assurance': 'Quality Assurance',
  };

  const legacySubTrackMapping = {
    First2Finish: 'FIRST_2_FINISH',
    Challenge: 'CODE',
    Task: 'TSK',
  };

  const track = (challenge.track ? legacyTracksMapping[challenge.track] : challenge.legacy.track) || 'DEVELOP';
  const subTrack = (challenge.type ? legacySubTrackMapping[challenge.type] : challenge.legacy.subTrack) || 'FIRST_2_FINISH';

  return (
    <tr styleName="paymentRow">
      <td styleName="icon">
        <TrackAbbreviationTooltip track={track} subTrack={subTrack}>
          <span>
            <TrackIcon
              track={track}
              subTrack={subTrack}
              tcoEligible={!_.isEmpty(challenge.events) ? challenge.events[0].name : ''}
              isDataScience={challenge.track === 'Data Science'}
            />
          </span>
        </TrackAbbreviationTooltip>
      </td>
      <td styleName="name">
        <Link
          to={`/${challenge.id}`}
        >
          {challenge.name}
        </Link>
      </td>
      <td styleName="price">
        { (new Date(_.get(challenge, 'updated'))).toLocaleString() }
      </td>
      <td styleName="price">
        {`$${_.get(challenge, 'totalPrize', '-')}`}
      </td>
      <td>
        {
          winner ? (
            <div styleName="member">
              <Avatar
                styleName="memberAvatar"
                url={getCdnAvatarUrl(winner.photoURL, 32)}
              />
              <span
                styleName="memberName"
              >
                <Link
                  enforceA
                  openNewTab
                  to={`${config.URL.BASE}/members/${winner.handle}`}
                >
                  {winner.handle}
                </Link>
              </span>
            </div>
          ) : 'N/A'
        }
      </td>
      <td>
        <PaymentStatus status={challenge.status} text={challenge.status} />
      </td>
    </tr>
  );
}

PaymentRow.propTypes = {
  challenge: PT.shape({
    id: PT.string,
    winners: PT.arrayOf(PT.object),
  }).isRequired,
};
