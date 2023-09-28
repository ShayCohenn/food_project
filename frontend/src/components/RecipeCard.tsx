import {
  Card,
  CardBody,
  Typography,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineStar } from "react-icons/ai";

interface RecipeProps {
  image: string;
  title: string;
  uuid: string;
  avg_rating: string;
  rating_count:number;
}

const RecipeCard = ({ image, title, uuid, avg_rating, rating_count }: RecipeProps) => {

  return (
    <Card className="w-[290px] h-[500px] mt-6 flex justify-between bg-base-300 text-base-content border border-gray-400">
      <div className="image-container w-full h-80">
        <img
          src={image}
          alt=""
          className="object-cover w-full h-full rounded-t-xl"
        />
      </div>

      <CardBody>
        <Typography variant="h5" className="mb-2 hover:underline">
          <Link to={`/recipe/${uuid}`}>{title}</Link>
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 flex justify-between">
        {avg_rating}/5 {" "} ({rating_count} Ratings)
        <div className="tooltip tooltip-bottom" data-tip="Add to favorites">
          <IconButton className="text-yellow-600 border border-base-content">
            <AiOutlineStar className="h-6 w-6" />
          </IconButton>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
