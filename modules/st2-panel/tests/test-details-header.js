import { expect } from 'chai';

import React from 'react';
import { ReactTester } from '@stackstorm/module-test-utils';

import { DetailsHeader } from '..';

describe(`${DetailsHeader.name} Component`, () => {
  describe('common functionality', () => {
    it('proxies className', () => {
      const instance = ReactTester.create(
        <DetailsHeader
          className="foobar"
          title="title"
        />
      );

      expect(instance.node.classList).to.contain('foobar');
    });

    it('proxies extra props', () => {
      const instance = ReactTester.create(
        <DetailsHeader
          foo="bar"
          title="title"
        />
      );

      expect(instance.node.props.foo).to.equal('bar');
    });
  });
});
