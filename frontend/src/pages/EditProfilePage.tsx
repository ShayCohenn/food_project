import Layout from "components/Layout";
import { firebaseConfig } from "config";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UpdateUserData } from "redux/api/types";
import {
  getUserDataAsync,
  updateUserAsync,
} from "redux/features/async_functions/userAsyncSlice";
import { user } from "redux/features/slices/userSlice";
import { useAppDispatch } from "redux/store";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";

const EditProfilePage = () => {
  const dispatch = useAppDispatch();
  const [email_disable, setEmailDisable] = useState(true);
  const [pwd_disable, setPwdDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email_content, setEmailContent] = useState("");
  const [pwd_content, setPwdContent] = useState("");
  const [error, setError] = useState("");
  const [avatarURL, setAvatarURL] = useState(""); // State for the avatar image URL
  const current_user = useSelector(user)
  const username = current_user.username;
  const email = current_user.email
  const navigate = useNavigate();
  const profile_pic = current_user.my_profile_pic

  useEffect(() => {
    dispatch(getUserDataAsync(username));
  }, []);

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0]; // Get the selected file
    const filename = uuidv4();
    const storageRef = ref(storage, `profile_images/${username}/${filename}`);

    try {
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      // Update the avatar URL in the state to display the uploaded image
      setAvatarURL(downloadURL);

      // You can save the downloadURL in your database or use it as needed
      console.log("File uploaded:", downloadURL);
    } catch (error) {
      // Handle the error
      console.error("Error uploading file:", error);
    }
  };

  const data: UpdateUserData = {
    username: username,
  };

  // Conditionally set email property
  if (email_content !== "") data.email = email_content;

  // Conditionally set password property
  if (pwd_content !== "") data.password = pwd_content;

  if (avatarURL) data.profile_pic = avatarURL;

  const handleSave = () => {
    setIsLoading(true);
    dispatch(updateUserAsync({ data, username }))
      .then((action) => {
        if (updateUserAsync.rejected.match(action)) {
          setError("Update failed, check your updated information.");
          setIsLoading(false);
        } else {
          setTimeout(() => {
            setIsLoading(false);
            navigate("/");
          }, 2000);
        }
      })
      .catch(() => {
        setError("An error occurred while changing your info.");
      });
  };

  return (
    <Layout title="SITE | Edit Profile" content="edit profile">
      <div className="flex flex-col items-center">
        <div className="mt-16 w-8/12">
          <div className="flex items-center xs:flex-col">
            <div className="avatar">
              <div className="w-36 rounded-full">
                <img src={avatarURL || profile_pic} alt="Avatar" />
              </div>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered ml-2"
              onChange={handleImageUpload} // Call the upload function when a file is selected
            />
          </div>
          <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
            email address
            <button
              onClick={() => setEmailDisable(!email_disable)}
              className="text-lg bg-transparent border-b border-base-content mx-4 px-3">
              Edit
            </button>
          </div>
          <input
            placeholder={email}
            className={`${
              email_disable ? "cursor-not-allowed" : "border-2"
            } focus:outline-blue-800 focus:border-none bg-transparent placeholder:text-base-content outline-none w-full px-3 py-3 leading-tight border border-base-content rounded-lg `}
            disabled={email_disable}
            onChange={(e) => setEmailContent(e.target.value)}
          />
          <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
            password
            <button
              onClick={() => setPwdDisable(!pwd_disable)}
              className="text-lg bg-transparent border-b border-base-content mx-4 px-3">
              Edit
            </button>
          </div>
          <input
            placeholder="························"
            type="password"
            className={`${
              pwd_disable ? "cursor-not-allowed" : "border-2"
            } focus:outline-blue-800 focus:border-none bg-transparent placeholder:text-base-content outline-none w-full px-3 py-3 leading-tight border border-base-content rounded-lg `}
            disabled={pwd_disable}
            onChange={(e) => setPwdContent(e.target.value)}
          />
          <button
            className={`custom-button mt-6 w-full ${
              isLoading ? "opacity-50 cursor-wait" : ""
            }`}
            onClick={handleSave}
            disabled={isLoading}>
            {isLoading ? "Saving..." : "SAVE"}
          </button>
          <p className="text-error">{error}</p>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfilePage;
