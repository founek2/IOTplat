import React, { Component } from "react";
import ControlComponent from './ControlComponent';
import {map} from 'ramda';

function createComponent({ body, created, data, title, _id, imgPath, manageData }) {
	return <ControlComponent title={title} key={_id} manageData={manageData} _id={_id} />
      
}

function ControlPanel({state}) {
		console.log(state)
		const controlComponents = map(createComponent, state.data);
		return (
			<div>
				{controlComponents}
			</div>
		)
	
}

export default ControlPanel;