import React from 'react';
import {render} from '@testing-library/react';
import {Tag} from './Tag';

test('renders a tag with low importance', () => {
    const tag = {
        name: "Java",
        importance: 1
    };
    const {getByText} = render(<Tag tag={tag}/>);
    const element = getByText(/Java/i);
    expect(element).toBeInTheDocument();
    expect(element.classList.contains('boldText')).toBe(false)
});

test('renders a tag with high importance', () => {
    const tag = {
        name: "Java",
        importance: 2
    };
    const {getByText} = render(<Tag tag={tag}/>);
    const tagName = getByText(/Java/i);
    expect(tagName).toBeInTheDocument();
    expect(tagName.classList.contains('boldText')).toBe(true)
});
