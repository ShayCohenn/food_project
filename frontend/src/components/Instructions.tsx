import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  created_recipe,
  addInstruction,
  updateInstructionTitle,
  updateInstructionText,
  removeInstruction,
} from "redux/features/slices/createRecipeSlice";

// Create a recipe instructions

const Instructions = () => {
  const dispatch = useDispatch();
  const instructions = useSelector(created_recipe).instructions;

  const handleAddInstruction = () => {
    dispatch(addInstruction({ title: "", text: "" }));
  };

  const handleTitleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const title = event.target.value;
    dispatch(updateInstructionTitle({ index, title }));
  };

  const handleTextChange = (
    index: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    dispatch(updateInstructionText({ index, text }));
  };

  const handleRemoveInstruction = (indexToRemove: number) => {
    dispatch(removeInstruction(indexToRemove));
  };

  return (
    <div>
      {instructions.map((instruction, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between">
            <input
              type="text"
              placeholder="Title (optional)"
              className="border border-base-content bg-base-100 p-2 w-1/3"
              value={instruction.title}
              onChange={(e) => handleTitleChange(index, e)}
            />
            <button
              className="btn btn-outline btn-error"
              onClick={() => handleRemoveInstruction(index)}>
              Remove
            </button>
          </div>
          <textarea
            placeholder="Instructions"
            className="border border-base-content bg-base-100 p-2 mt-2 w-full"
            value={instruction.instructions}
            onChange={(e) => handleTextChange(index, e)}
          />
        </div>
      ))}
      <button
        className="btn btn-outline btn-success"
        onClick={handleAddInstruction}>
        Add Instruction
      </button>
    </div>
  );
};

export default Instructions;
