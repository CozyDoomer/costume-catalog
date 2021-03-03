import React from "react";
import Button from 'react-bootstrap/Button';
import "./AddButton.css"

export function AddButton(props) {
    return <div className="row">
            <Button variant="primary"
                className="Button"
                style={{float: 'right', margin: '20px'}}
                onClick={e => props.createCostume(e.target.value)}
                >Add Costume
            </Button>
        </div>
}