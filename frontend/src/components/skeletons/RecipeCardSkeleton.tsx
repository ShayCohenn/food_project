import React from "react";
import { Card, CardBody, CardFooter, IconButton } from "@material-tailwind/react";

const RecipeCardSkeleton = () => {
  return (
    <Card className="w-[290px] h-[500px] mt-6 mr-4 flex justify-between bg-base-300 animate-pulse">
      <div className="image-container w-full h-80 bg-gray-600/70 rounded-t-xl"></div>

      <CardBody>
        <div className="mb-2 bg-gray-600/70 h-6 w-3/4"></div>
      </CardBody>
      <CardFooter className="pt-0 flex justify-between">
        <span className="bg-gray-600/70 h-5 w-1/2"></span>
        <div className="tooltip tooltip-bottom" data-tip="Add to favorites">
          <IconButton className="text-yellow-600 bg-gray-600/70">
          </IconButton>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCardSkeleton;
