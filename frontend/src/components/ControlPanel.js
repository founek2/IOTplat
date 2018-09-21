import React from 'react';
import ControlComponent from './ControlComponent';
import { map } from 'ramda';

function createComponent(handleSimpleMode) {
     return function({ title, _id, manageData }) {
          return (
               <ControlComponent title={title} key={_id} manageData={manageData} _id={_id} handleSimpleMode={handleSimpleMode} />
          );
     };
}

function ControlPanel({ state, handleSimpleMode }) {
     if (state.simpleMode) {
          const data = state.data.find(({ _id }) => _id === state.simpleMode);
          const { title, _id, manageData } = data;
          return (
               <ControlComponent
                    title={title}
                    key={_id}
                    manageData={manageData}
                    _id={_id}
                    handleSimpleMode={handleSimpleMode}
                    simpleMode={state.simpleMode}
               />
          );
     } else {
          const controlComponents = map(createComponent(handleSimpleMode), state.data);

          return <div>{controlComponents}</div>;
     }
}

export default ControlPanel;
