import moment from "moment";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const CommentItem = ({ comment }) => {
  return (
    <li className="ml-10 mt-2">
      <hr className="border border-gray-900 mb-2" />
      <div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-900">
            {comment?.user?.profileImg ? (
              <img
                src={comment?.user?.profileImg}
                alt="profile"
                className="h-full w-full rounded-full"
              />
            ) : (
              <FaUserCircle className="h-full w-full text-gray-500" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">
              @{comment?.user.username}
            </span>
            <span className="text-gray-600 text-xs ">
              {moment(comment?.createdAt).format("lll")}
            </span>
          </div>
        </div>
        <span className="text-gray-300 ml-12">{comment?.text}</span>
      </div>
      <hr className="border border-gray-900 mt-2" />
    </li>
  );
};

export default CommentItem;
