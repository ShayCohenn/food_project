export interface Ingredient {
  ingredient: string;
  amount: string;
  notes: string;
}

interface Instructions {
  title: string;
  instructions: string;
}

export interface Cuisines {
    cuisine: string;
    country: string;
    flag: string;
}

export interface Rating {
  user?: {
    username: string;
    profile_pic: string;
  };
  rating: string;
  formatted_date?: string;
  was_edited?: boolean;
}

export interface Comment {
  user?: {
    username: string;
    profile_pic: string;
  };
  comment: string;
  formatted_date?: string;
  was_edited?: boolean;
  rating: string;
}

export interface Recipe {
  uuid: string;
  cuisine: Cuisines;
  title: string;
  description: string;
  thumbnail: string;
  instructions: Instructions[];
  post_date: string;
  difficulty: string;
  est_time: string;
  servings: string;
  user: {
    username: string;
    profile_pic: string;
  };
  tags: string[];
  ingredients: Ingredient[];
  ratings: Rating[];
  comments: Comment[];
  average_rating: string;
  user_count: number;
}

export interface GetDataCreateRecipe {
  cuisines: Cuisines[];
  ingredients: Ingredient[];
}

export interface CreateRecipe {
  cuisine: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    filename: string;
  };
  instructions: Instructions[];
  difficulty: string;
  est_time: string;
  servings: string;
  ingredients: Ingredient[];
  getData: GetDataCreateRecipe;
}

export interface CreateRecipeMethod {
  cuisine: string;
  title: string;
  description: string;
  thumbnail: string;
  directions: Instructions[];
  difficulty: string;
  est_time: string;
  servings: string;
  ingredients: Ingredient[];
}
// ---------------------------------------- User Types ------------------------------------

export interface FollowUserType {
  username: string;
  profile_pic: string;
}

export interface User {
  username: string;
  email: string;
  id: string;
  profile_pic: string;
  my_profile_pic: string;
  total_followers: number;
  total_following: number;
  total_recipes: number;
  my_followers: FollowUserType[];
  my_following: FollowUserType[];
  followers: FollowUserType[];
  following: FollowUserType[];
  isFollowing: boolean;
  isOwner: boolean;
  recipes: Recipe[];
}

export interface UserProperties {
  access: string;
  refresh: string;
  isUserExists: "yes" | "no" | "waiting";
  user: User;
  theme: string;
}

export interface VerifyEmail {
  email: string;
  username: string;
}

export interface RegisterCreds {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  verification_code: string;
}

export interface UpdateUserData {
  username: string;
  email?: string;
  password?: string;
  profile_pic?: string;
}

export interface SearchedUser {
  username: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  follower_count: number;
  following_count: number;
  follower_list: string[];
  following_list: string[];
  recipe_count: number;
}

export interface resetData{
  email:string;
  code:string;
  new_password:string;
}