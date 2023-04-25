/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
import React from 'react';
import { renderHook } from 'wrappedTestingLibrary/hooks';

import useEventDefinitionConfigFromUrl from 'components/event-definitions/hooks/useEventDefinitionConfigFromUrl';
import asMock from 'helpers/mocking/AsMock';
import useQuery from 'routing/useQuery';
import {
  urlConfigWithAggString,
  urlConfigWithFunctionAggString,
  urlConfigWithoutAggString,
} from 'fixtures/createEventDefinitionFromValue';

jest.mock('routing/useQuery', () => jest.fn());

const wrapper = ({ children }) => (
  <div>
    {children}
  </div>
);

describe('useEventDefinitionConfigFromUrl', () => {
  it('return data with conditions part when function, field and value exist', async () => {
    asMock(useQuery).mockReturnValue({ config: urlConfigWithAggString });
    const { result, waitFor } = renderHook(() => useEventDefinitionConfigFromUrl(), { wrapper });
    await waitFor(() => !!result.current);

    expect(result.current).toEqual(
      {
        configFromUrl: {
          conditions: {
            expression: {
              left: {
                expr: 'number-ref',
                ref: 'count-action',
              },
              right: {
                expr: 'number',
                value: 400,
              },
            },
          },
          group_by: [
            'action',
            'action',
            'http_method',
          ],
          query: '(http_method:GET) AND ((http_method:GET)) AND (action:show)',
          query_parameters: [
            {
              data_type: 'any',
              default_value: 'GET',
              description: '',
              key: 'lt',
              lookup_table: 'http_method',
              name: 'newParameter',
              optional: false,
              title: 'lt',
              type: 'lut-parameter-v1',
            },
          ],
          search_within_ms: 300000,
          series: [
            {
              field: 'action',
              function: 'count',
              id: 'count-action',
            },
          ],
          streams: [
            'streamId-1',
            'streamId-2',
          ],
          type: 'aggregation-v1',
        },
        hasUrlConfig: true,
      },
    );
  });

  it('return data with conditions part when only function and value exist', async () => {
    asMock(useQuery).mockReturnValue({ config: urlConfigWithFunctionAggString });
    const { result, waitFor } = renderHook(() => useEventDefinitionConfigFromUrl(), { wrapper });
    await waitFor(() => !!result.current);

    expect(result.current).toEqual(
      {
        configFromUrl: {
          conditions: {
            expression: {
              left: {
                expr: 'number-ref',
                ref: 'count-undefined',
              },
              right: {
                expr: 'number',
                value: 400,
              },
            },
          },
          group_by: [
            'action',
            'action',
            'http_method',
          ],
          query: '(http_method:GET) AND ((http_method:GET)) AND (action:show)',
          query_parameters: [
            {
              data_type: 'any',
              default_value: 'GET',
              description: '',
              key: 'lt',
              lookup_table: 'http_method',
              name: 'newParameter',
              optional: false,
              title: 'lt',
              type: 'lut-parameter-v1',
            },
          ],
          search_within_ms: 300000,
          series: [
            {
              function: 'count',
              id: 'count-undefined',
            },
          ],
          streams: [
            'streamId-1',
            'streamId-2',
          ],
          type: 'aggregation-v1',
        },
        hasUrlConfig: true,
      },
    );
  });

  it('return data without conditions part when function not exist', async () => {
    asMock(useQuery).mockReturnValue({ config: urlConfigWithoutAggString });
    const { result, waitFor } = renderHook(() => useEventDefinitionConfigFromUrl(), { wrapper });
    await waitFor(() => !!result.current);

    expect(result.current).toEqual(
      {
        configFromUrl: {
          group_by: [],
          query: '(http_method:GET) AND ((http_method:GET)) AND (action:show)',
          query_parameters: [
            {
              data_type: 'any',
              default_value: 'GET',
              description: '',
              key: 'lt',
              lookup_table: 'http_method',
              name: 'newParameter',
              optional: false,
              title: 'lt',
              type: 'lut-parameter-v1',
            },
          ],
          search_within_ms: 300000,
          streams: [
            'streamId-1',
            'streamId-2',
          ],
          type: 'aggregation-v1',
        },
        hasUrlConfig: true,
      },
    );
  });

  it('return hasUrlConfig when no url config data', async () => {
    asMock(useQuery).mockReturnValue({ config: {} });
    const { result, waitFor } = renderHook(() => useEventDefinitionConfigFromUrl(), { wrapper });
    await waitFor(() => !!result.current);

    expect(result.current).toEqual(
      {
        configFromUrl: undefined,
        hasUrlConfig: false,
      },
    );
  });
});