import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStrore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { User } from "lucide-react";
import { useAuthStore } from "../store/userAuthStore";

export default function Sidebar() {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly,setShowOnlineOnly]= useState(false)
  useEffect(() => {
    getUsers();
  }, [getUsers]);
const filterUsers = showOnlineOnly ? users.filter(user=> onlineUsers.includes(user._id)):users;
  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className={`h-full w-[300px] max-[500px]:!w-full border-r border-base-300 flex-col transition-all duration-200 ${selectedUser? "hidden sm:flex": "!flex"}`}>
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex  gap-2">
          <User className="size-6" />
          <span className="font-medium block">Contacts </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>
      
      <div className="overflow-y-auto w-full py-3">
        {filterUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {
          filterUsers.length===0 && <div className="text-center text-zinc-500 py-5">No online User </div>
        }
      </div>

    </aside>
  );
}
