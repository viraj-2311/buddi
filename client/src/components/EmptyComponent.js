import React from 'react';
import { EmptyComponent } from './EmptyComponent.style';

export default function({ text }) {
  return (
    <EmptyComponent className="isoEmptyComponent">
      <h2>{text ? text : 'You have no content'}</h2>
    </EmptyComponent>
  );
}
