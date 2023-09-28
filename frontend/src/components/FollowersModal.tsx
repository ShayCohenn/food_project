import React, { useEffect, useRef, useState } from "react";
import MiniUser from "./MiniUser";
import { FollowUserType } from "redux/api/types";

interface FollowersModalProps {
  handleClose: () => void;
  users: FollowUserType[];
  title: string;
}

const FollowersModal: React.FC<FollowersModalProps> = ({
  handleClose,
  users,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      setIsOpen(false);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [handleClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-800">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}></div>
      <div
        ref={modalRef}
        className="relative w-8/12 max-w-[500px] bg-base-100 p-4 rounded-lg shadow-lg">
        <div className="text-3xl text-center mb-4 font-bold">
          {title}
          <button
            onClick={handleClose}
            className="btn btn-sm text-xl btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </div>
        <hr />
        <div className="h-full overflow-y-scroll">
          {users.map((user, index) => (
            <MiniUser
              key={index}
              mini_user={user}
              handleCloseModal={handleClose} // Pass handleClose function to MiniUser
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
