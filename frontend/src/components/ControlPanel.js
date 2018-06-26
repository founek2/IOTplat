import React from "react";
import ControlComponent from './ControlComponent';
import {map} from 'ramda';

function createComponent({ title, _id, manageData }) {
	return <ControlComponent title={title} key={_id} manageData={manageData} _id={_id} />
      
}

function ControlPanel({state}) {
		const controlComponents = map(createComponent, state.data);
		return (
			<div>
				{controlComponents}
			</div>
		)
	
}

export default ControlPanel;