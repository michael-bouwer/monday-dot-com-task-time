import React from "react";
import Button from "../../components/Button";
import './styles.scss';

function AddNew() {
  return (
    <div className="add-new">
      <p className="text">Create a new <strong>campaign</strong>, <strong>project</strong> or <strong>event</strong>.</p>
      <Button medium text="Add New" />
    </div>
  );
}

export default AddNew;
