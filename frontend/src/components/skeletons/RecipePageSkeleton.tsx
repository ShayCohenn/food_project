import Layout from "components/Layout";

const RecipePageSkeleton = () => {
  return (
    <Layout title="Loading..." content="recipe">
      <div className="flex flex-col">
        <div className="mt-28">
          <div className="container mx-auto p-4">
            <div className="flex xs:flex-col-reverse">
              {/* Recipe Details */}
              <div className="flex items-start w-full p-4 relative border border-base-content/70 mt-4">
                <h1 className="text-2xl font-semibold ">Loading</h1>
                <span className="loading loading-dots loading-sm mt-4"></span>
                {/* Add placeholders for other recipe details */}
              </div>

              {/* Recipe Image */}
              <div className="w-full p-4">
                <div className="flex items-center gap-2">
                  {/* Add a placeholder for the rating */}
                  {/* Add a placeholder for other recipe image details */}
                </div>
                <div className="flex items-center"></div>
                <div className="w-full h-96 bg-gray-600/70 animate-pulse"></div>
                <div className="flex items-center mt-2">
                  <div className="w-7 h-7 rounded-full bg-gray-600/70 animate-pulse"></div>
                  <span className="text-xl mx-1 mt-2 bg-gray-600/70 animate-pulse"></span>
                </div>
                <div className="h-4 bg-gray-600/70 mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipePageSkeleton;
