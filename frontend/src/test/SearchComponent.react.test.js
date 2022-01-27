import React from 'react';
import renderer from 'react-test-renderer';
import SearchComponent from '../components/SearchComponent';

test('renders correctly', () => {
    const tree = renderer.create(<SearchComponent />).toJSON();
    expect(tree).toMatchSnapshot();
    });