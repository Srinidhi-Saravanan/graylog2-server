// @flow strict
import Reflux from 'reflux';
import { get } from 'lodash';

// $FlowFixMe: imports from core need to be fixed in flow
import fetch from 'logic/rest/FetchProvider';
// $FlowFixMe: imports from core need to be fixed in flow
import URLUtils from 'util/URLUtils';

import ViewSharing from 'enterprise/logic/views/sharing/ViewSharing';
import UserShortSummary from '../logic/views/sharing/UserShortSummary';

const viewSharingUrl = viewId => URLUtils.qualifyUrl(`/plugins/org.graylog.plugins.enterprise/views/${viewId}/share`);

type ViewSharingActionsType = {
  get: (string) => Promise<ViewSharing>,
  create: (string, ViewSharing) => Promise<ViewSharing>,
  remove: (string) => Promise<ViewSharing>,
  users: (string) => Promise<Array<UserShortSummary>>,
};

export const ViewSharingActions: ViewSharingActionsType = Reflux.createActions({
  create: { asyncResult: true },
  get: { asyncResult: true },
  remove: { asyncResult: true },
  users: { asyncResult: true },
});

export const ViewSharingStore = Reflux.createStore({
  listenables: [ViewSharingActions],

  create(viewId: string, viewSharing: ViewSharing): Promise<ViewSharing> {
    const promise = fetch('POST', viewSharingUrl(viewId), JSON.stringify(viewSharing))
      .then(ViewSharing.fromJSON);
    ViewSharingActions.create.promise(promise);
    return promise;
  },

  get(viewId: string): Promise<ViewSharing> {
    const promise = fetch('GET', viewSharingUrl(viewId))
      .then(
        ViewSharing.fromJSON,
        (error) => {
          const status = get(error, 'additional.status');
          if (status === 404) {
            return null;
          }
          throw error;
        },
      );
    ViewSharingActions.get.promise(promise);
    return promise;
  },

  remove(viewId: string): Promise<ViewSharing> {
    const promise = fetch('DELETE', viewSharingUrl(viewId))
      .then(ViewSharing.fromJSON);
    ViewSharingActions.remove.promise(promise);
    return promise;
  },

  users(viewId: string): Promise<Array<UserShortSummary>> {
    const promise = fetch('GET', `${viewSharingUrl(viewId)}/users`)
      .then(response => response.map(UserShortSummary.fromJSON));
    ViewSharingActions.users.promise(promise);
    return promise;
  },
});
